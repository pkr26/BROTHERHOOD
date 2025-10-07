import { getPasswordStrength } from '../../utils/validation';

/**
 * Password strength indicator component
 *
 * @param {Object} props
 * @param {string} props.password - Password to check
 */
const PasswordStrengthIndicator = ({ password }) => {
  const strength = getPasswordStrength(password);

  const getColorClass = () => {
    switch (strength.strength) {
      case 'strong':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'weak':
        return 'bg-danger';
      default:
        return 'bg-gray-300';
    }
  };

  const getTextColorClass = () => {
    switch (strength.strength) {
      case 'strong':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'weak':
        return 'text-danger';
      default:
        return 'text-gray-500';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              strength.score >= level * 2.3 ? getColorClass() : 'bg-gray-200'
            }`}
            role="presentation"
          />
        ))}
      </div>
      <p className={`text-xs ${getTextColorClass()}`}>
        {strength.strength === 'strong'
          ? '✓ Strong password'
          : strength.strength === 'medium'
          ? '○ Good password'
          : '✗ Weak password'}
        {strength.feedback.length > 0 && ` - ${strength.feedback[0]}`}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
