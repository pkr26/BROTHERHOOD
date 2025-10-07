import { useState } from 'react';
import clsx from 'clsx';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

/**
 * Password input with toggle visibility button
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.id - Input id
 * @param {string} props.placeholder - Input placeholder
 * @param {Object} props.error - Error object from react-hook-form
 * @param {string} props.className - Additional className
 * @param {Object} props.register - Register function from react-hook-form
 */
const PasswordInput = ({
  label = 'Password',
  id,
  placeholder = 'Enter your password',
  error,
  className = '',
  register = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          {...register}
          className={clsx(
            'form-input pl-10 pr-10',
            error && 'border-danger focus:ring-danger'
          )}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <MdVisibilityOff className="text-xl" />
          ) : (
            <MdVisibility className="text-xl" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="form-error mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
