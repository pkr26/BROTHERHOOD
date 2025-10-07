import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { ButtonLoader } from '../components/common/Loading';
import AuthLayout from '../components/layouts/AuthLayout';
import FormField from '../components/forms/FormField';
import PasswordInput from '../components/forms/PasswordInput';

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        setError('email', { message: result.error });
      }
    } catch (error) {
      setError('email', { message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back, Brother"
      subtitle="Your brotherhood awaits. Sign in to continue your journey."
      logoGradient="from-primary to-primary-dark"
      footer={
        <div className="p-4 bg-primary-lighter/10 rounded-lg border border-primary-lighter/20">
          <p className="text-sm text-center text-gray-700">
            <span className="font-semibold">Need support?</span> Remember, you're
            not alone. We're here to help you through your journey.
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          label="Email Address"
          type="email"
          id="email"
          placeholder="Enter your email"
          error={errors.email}
          icon={MdEmail}
          register={register('email', {
            required: 'Email is required',
            validate: validateEmail,
          })}
        />

        {/* Password Field */}
        <PasswordInput
          label="Password"
          id="password"
          placeholder="Enter your password"
          error={errors.password}
          register={register('password', {
            required: 'Password is required',
            validate: validatePassword,
          })}
        />

        {/* Forgot Password */}
        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <ButtonLoader
          type="submit"
          loading={loading}
          className="w-full btn btn-primary py-3"
        >
          Sign In to Brotherhood
        </ButtonLoader>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">
              New to Brotherhood?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center w-full py-3 px-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
          >
            Create Your Account
            <span className="ml-2">→</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
