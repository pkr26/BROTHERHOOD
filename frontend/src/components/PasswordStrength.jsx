import React from 'react';

const PasswordStrength = ({ password }) => {
  const calculateStrength = () => {
    if (!password) return { strength: 0, text: '', className: '' };

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate strength based on criteria met
    Object.values(checks).forEach(passed => {
      if (passed) strength++;
    });

    // Bonus for length
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;

    if (strength <= 2) {
      return { strength: 1, text: 'Weak', className: 'weak' };
    } else if (strength <= 4) {
      return { strength: 2, text: 'Medium', className: 'medium' };
    } else {
      return { strength: 3, text: 'Strong', className: 'strong' };
    }
  };

  const { text, className } = calculateStrength();

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div className={`strength-fill ${className}`}></div>
      </div>
      <span className={`strength-text ${className}`}>
        Password strength: {text}
      </span>
    </div>
  );
};

export default PasswordStrength;