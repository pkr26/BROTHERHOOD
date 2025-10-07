import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import BrotherhoodLogo from '../components/BrotherhoodLogo';
import {
  EmailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  CheckIcon,
  XIcon
} from '../components/Icons';
import PasswordStrength from '../components/PasswordStrength';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 100);

    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) {
      // Add shake animation to form
      const form = document.querySelector('.auth-form');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const { confirmPassword, acceptTerms, ...registrationData } = formData;

      await axiosInstance.post('/api/auth/register', registrationData);

      // Registration successful
      setSuccessMessage('Registration successful! Redirecting to login...');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during registration');
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
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join us to get started with your journey</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <div className="error-icon">
                <CheckIcon />
              </div>
              {successMessage}
            </div>
          )}

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
            {/* First Name Field */}
            <div className="form-group modern-input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="modern-input"
                  autoComplete="given-name"
                />
                <label htmlFor="first_name" className="floating-label">First Name</label>
                <div className="input-icon">
                  <UserIcon />
                </div>
              </div>
            </div>

            {/* Last Name Field */}
            <div className="form-group modern-input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="modern-input"
                  autoComplete="family-name"
                />
                <label htmlFor="last_name" className="floating-label">Last Name</label>
                <div className="input-icon">
                  <UserIcon />
                </div>
              </div>
            </div>

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
                  autoComplete="new-password"
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
              {/* Password Strength Indicator */}
              <PasswordStrength password={formData.password} />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group modern-input-group">
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="modern-input"
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
                <div className="input-icon">
                  <LockIcon />
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {formData.confirmPassword && formData.password && (
                <div style={{ marginTop: '8px' }}>
                  {formData.password === formData.confirmPassword ? (
                    <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 500 }}>
                      <CheckIcon style={{ width: '14px', height: '14px', display: 'inline' }} /> Passwords match
                    </span>
                  ) : (
                    <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 500 }}>
                      <XIcon style={{ width: '14px', height: '14px', display: 'inline' }} /> Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">
                  I agree to the{' '}
                  <a href="/terms" className="forgot-link" style={{ fontSize: '14px' }}>
                    Terms & Conditions
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn modern-submit"
              disabled={loading}
            >
              <span className={loading ? 'btn-text-hidden' : ''}>
                Create account
              </span>
              {loading && (
                <div className="spinner">
                  <div className="spinner-circle"></div>
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link-modern">
                Sign in <span className="link-arrow">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;