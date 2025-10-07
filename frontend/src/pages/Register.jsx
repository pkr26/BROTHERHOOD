import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MdEmail, MdPerson, MdCalendarToday, MdCheck } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateDateOfBirth,
} from '../utils/validation';
import { ButtonLoader } from '../components/common/Loading';
import AuthLayout from '../components/layouts/AuthLayout';
import FormField from '../components/forms/FormField';
import PasswordInput from '../components/forms/PasswordInput';
import PasswordStrengthIndicator from '../components/forms/PasswordStrengthIndicator';
import logger from '../utils/logger';

const Register = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    mode: 'onBlur',
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    logger.info('Registration form submitted', { email: data.email });

    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
      });

      if (!result.success) {
        logger.warn('Registration form validation failed', { email: data.email });
        setError('email', { message: result.error });
      }
    } catch (error) {
      logger.error('Registration form error', { email: data.email, error: error.message });
      setError('email', { message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the Brotherhood"
      subtitle="Create your account and become part of a supportive community"
      logoGradient="from-primary to-primary-dark"
      footer={
        <div className="p-4 bg-primary-lighter/10 rounded-lg border border-primary-lighter/20">
          <p className="text-sm text-center text-gray-700">
            <span className="font-semibold">Our Promise:</span> Your journey is safe
            with us. We're building a community where men support each other through
            life's challenges.
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            type="text"
            id="firstName"
            placeholder="John"
            error={errors.firstName}
            icon={MdPerson}
            register={register('firstName', {
              required: 'First name is required',
              validate: (value) => validateName(value, 'First name'),
            })}
          />

          <FormField
            label="Last Name"
            type="text"
            id="lastName"
            placeholder="Doe"
            error={errors.lastName}
            icon={MdPerson}
            register={register('lastName', {
              required: 'Last name is required',
              validate: (value) => validateName(value, 'Last name'),
            })}
          />
        </div>

        {/* Email */}
        <FormField
          label="Email Address"
          type="email"
          id="email"
          placeholder="john@example.com"
          error={errors.email}
          icon={MdEmail}
          register={register('email', {
            required: 'Email is required',
            validate: validateEmail,
          })}
        />

        {/* Date of Birth */}
        <FormField
          label="Date of Birth"
          type="date"
          id="dateOfBirth"
          error={errors.dateOfBirth}
          icon={MdCalendarToday}
          register={register('dateOfBirth', {
            required: 'Date of birth is required',
            validate: validateDateOfBirth,
          })}
        />

        {/* Password */}
        <div>
          <PasswordInput
            label="Password"
            id="password"
            placeholder="Create a strong password"
            error={errors.password}
            register={register('password', {
              required: 'Password is required',
              validate: validatePassword,
            })}
          />
          <PasswordStrengthIndicator password={password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className={`form-input pl-10 ${
                errors.confirmPassword ? 'border-danger focus:ring-danger' : ''
              }`}
              placeholder="Confirm your password"
            />
            <MdCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
          {errors.confirmPassword && (
            <p className="form-error mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              {...register('terms', {
                required: 'You must accept the terms and conditions',
              })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:text-primary-dark">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:text-primary-dark">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && <p className="form-error mt-1">{errors.terms.message}</p>}
        </div>

        {/* Submit Button */}
        <ButtonLoader
          type="submit"
          loading={loading}
          className="w-full btn btn-primary py-3"
        >
          Create Your Brotherhood Account
        </ButtonLoader>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
