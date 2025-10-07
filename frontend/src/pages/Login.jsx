import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import BrotherhoodLogo from '../components/BrotherhoodLogo';
import {
  EmailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon
} from '../components/Icons';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Check for remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Store user info in localStorage (no token needed, using HTTP-only cookies)
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
      // Add shake animation to form
      const form = document.querySelector('.auth-form');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Subtle background pattern */}
      <div className="auth-bg-animation"></div>

      <div className="auth-container">
        <div className="auth-card glass-effect">
          {/* Logo/Brand Section */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">
                <BrotherhoodLogo />
              </div>
              <span className="logo-text">Brotherhood</span>
            </div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to continue to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message modern-error">
              <div className="error-icon">
                <XIcon />
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={`auth-form ${isTyping ? 'typing' : ''}`}>
            {/* Email Field */}
            <div className="form-group modern-input-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="modern-input"
                  autoComplete="email"
                />
                <label htmlFor="email" className="floating-label">Email address</label>
                <div className="input-icon">
                  <EmailIcon />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group modern-input-group">
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="modern-input"
                  autoComplete="current-password"
                />
                <label htmlFor="password" className="floating-label">Password</label>
                <div className="input-icon">
                  <LockIcon />
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn modern-submit"
              disabled={loading}
            >
              <span className={loading ? 'btn-text-hidden' : ''}>
                Sign in
              </span>
              {loading && (
                <div className="spinner">
                  <div className="spinner-circle"></div>
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link-modern">
                Sign up <span className="link-arrow">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;