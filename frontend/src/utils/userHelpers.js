/**
 * User-related utility functions
 */

/**
 * Get user initials from first and last name
 * @param {Object} user - User object with first_name and last_name
 * @returns {string} User initials (e.g., "JD" for John Doe)
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  const firstInitial = user.first_name?.[0] || '';
  const lastInitial = user.last_name?.[0] || '';
  return (firstInitial + lastInitial).toUpperCase() || 'U';
};

/**
 * Get full name from user object
 * @param {Object} user - User object
 * @returns {string} Full name
 */
export const getFullName = (user) => {
  if (!user) return 'User';
  return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
};

/**
 * Get display name (first name or username)
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getDisplayName = (user) => {
  if (!user) return 'User';
  return user.first_name || user.username || 'User';
};

/**
 * Format user age with label
 * @param {number} age - User age
 * @returns {string} Formatted age string
 */
export const formatUserAge = (age) => {
  if (!age || isNaN(Number(age))) return '';
  return `Age: ${age}`;
};
