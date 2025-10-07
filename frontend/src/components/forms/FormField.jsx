import clsx from 'clsx';

/**
 * Reusable form field component with label, input, icon, and error message
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.type - Input type
 * @param {string} props.id - Input id
 * @param {string} props.placeholder - Input placeholder
 * @param {Object} props.error - Error object from react-hook-form
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.className - Additional className
 * @param {Object} props.register - Register function from react-hook-form
 * @param {boolean} props.required - Whether field is required
 */
const FormField = ({
  label,
  type = 'text',
  id,
  placeholder,
  error,
  icon: Icon,
  className = '',
  register = {},
  required = false,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          {...register}
          className={clsx(
            'form-input',
            Icon && 'pl-10',
            error && 'border-danger focus:ring-danger'
          )}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="form-error mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;
