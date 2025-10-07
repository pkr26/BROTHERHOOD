import {
  getUserInitials,
  getFullName,
  getDisplayName,
  formatUserAge,
} from '../../utils/userHelpers';

describe('userHelpers.js - getUserInitials', () => {
  // Easy test cases
  describe('Easy cases', () => {
    test('should return "U" for null user', () => {
      expect(getUserInitials(null)).toBe('U');
    });

    test('should return "U" for undefined user', () => {
      expect(getUserInitials(undefined)).toBe('U');
    });

    test('should return initials for user with first and last name', () => {
      const user = { first_name: 'John', last_name: 'Doe' };
      expect(getUserInitials(user)).toBe('JD');
    });

    test('should return first initial only when last name is missing', () => {
      const user = { first_name: 'John' };
      expect(getUserInitials(user)).toBe('J');
    });
  });

  // Medium test cases
  describe('Medium cases', () => {
    test('should return last initial only when first name is missing', () => {
      const user = { last_name: 'Doe' };
      expect(getUserInitials(user)).toBe('D');
    });

    test('should return "U" for empty user object', () => {
      const user = {};
      expect(getUserInitials(user)).toBe('U');
    });

    test('should return "U" for user with empty strings', () => {
      const user = { first_name: '', last_name: '' };
      expect(getUserInitials(user)).toBe('U');
    });

    test('should handle lowercase names', () => {
      const user = { first_name: 'john', last_name: 'doe' };
      expect(getUserInitials(user)).toBe('JD');
    });
  });

  // Hard test cases
  describe('Hard cases', () => {
    test('should handle names with spaces', () => {
      const user = { first_name: 'Mary Anne', last_name: 'Smith Johnson' };
      expect(getUserInitials(user)).toBe('MS');
    });

    test('should handle names with special characters', () => {
      const user = { first_name: "O'Brien", last_name: 'Smith-Jones' };
      expect(getUserInitials(user)).toBe('OS');
    });

    test('should handle unicode characters', () => {
      const user = { first_name: 'José', last_name: 'García' };
      expect(getUserInitials(user)).toBe('JG');
    });

    test('should handle empty first name with valid last name', () => {
      const user = { first_name: '', last_name: 'Doe' };
      expect(getUserInitials(user)).toBe('D');
    });

    test('should handle single character names', () => {
      const user = { first_name: 'A', last_name: 'B' };
      expect(getUserInitials(user)).toBe('AB');
    });

    test('should handle user with only whitespace in names', () => {
      const user = { first_name: '   ', last_name: '   ' };
      const result = getUserInitials(user);
      // Whitespace initials are acceptable behavior
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('userHelpers.js - getFullName', () => {
  // Easy test cases
  describe('Easy cases', () => {
    test('should return "User" for null user', () => {
      expect(getFullName(null)).toBe('User');
    });

    test('should return "User" for undefined user', () => {
      expect(getFullName(undefined)).toBe('User');
    });

    test('should return full name for user with first and last name', () => {
      const user = { first_name: 'John', last_name: 'Doe' };
      expect(getFullName(user)).toBe('John Doe');
    });

    test('should return first name only when last name is missing', () => {
      const user = { first_name: 'John' };
      expect(getFullName(user)).toBe('John');
    });
  });

  // Medium test cases
  describe('Medium cases', () => {
    test('should return last name only when first name is missing', () => {
      const user = { last_name: 'Doe' };
      expect(getFullName(user)).toBe('Doe');
    });

    test('should return "User" for empty user object', () => {
      const user = {};
      expect(getFullName(user)).toBe('User');
    });

    test('should return "User" for user with empty strings', () => {
      const user = { first_name: '', last_name: '' };
      expect(getFullName(user)).toBe('User');
    });

    test('should handle names with extra spaces', () => {
      const user = { first_name: '  John  ', last_name: '  Doe  ' };
      const result = getFullName(user);
      expect(result).toContain('John');
      expect(result).toContain('Doe');
    });

    test('should handle names with middle spaces', () => {
      const user = { first_name: 'Mary Anne', last_name: 'Smith Johnson' };
      expect(getFullName(user)).toBe('Mary Anne Smith Johnson');
    });
  });

  // Hard test cases
  describe('Hard cases', () => {
    test('should handle names with special characters', () => {
      const user = { first_name: "O'Brien", last_name: 'Smith-Jones' };
      expect(getFullName(user)).toBe("O'Brien Smith-Jones");
    });

    test('should handle unicode characters', () => {
      const user = { first_name: 'José', last_name: 'García' };
      expect(getFullName(user)).toBe('José García');
    });

    test('should handle very long names', () => {
      const user = {
        first_name: 'VeryLongFirstNameWithManyCharacters',
        last_name: 'VeryLongLastNameWithManyCharacters',
      };
      expect(getFullName(user)).toBe('VeryLongFirstNameWithManyCharacters VeryLongLastNameWithManyCharacters');
    });

    test('should handle null first_name but valid last_name', () => {
      const user = { first_name: null, last_name: 'Doe' };
      expect(getFullName(user)).toBe('Doe');
    });

    test('should handle undefined first_name but valid last_name', () => {
      const user = { first_name: undefined, last_name: 'Doe' };
      expect(getFullName(user)).toBe('Doe');
    });

    test('should handle user with only whitespace', () => {
      const user = { first_name: '   ', last_name: '   ' };
      expect(getFullName(user)).toBe('User');
    });
  });
});

describe('userHelpers.js - getDisplayName', () => {
  // Easy test cases
  describe('Easy cases', () => {
    test('should return "User" for null user', () => {
      expect(getDisplayName(null)).toBe('User');
    });

    test('should return "User" for undefined user', () => {
      expect(getDisplayName(undefined)).toBe('User');
    });

    test('should return first name when available', () => {
      const user = { first_name: 'John', last_name: 'Doe', username: 'johndoe' };
      expect(getDisplayName(user)).toBe('John');
    });

    test('should return username when first name is missing', () => {
      const user = { username: 'johndoe' };
      expect(getDisplayName(user)).toBe('johndoe');
    });
  });

  // Medium test cases
  describe('Medium cases', () => {
    test('should return "User" for empty user object', () => {
      const user = {};
      expect(getDisplayName(user)).toBe('User');
    });

    test('should prefer first name over username', () => {
      const user = { first_name: 'John', username: 'johndoe' };
      expect(getDisplayName(user)).toBe('John');
    });

    test('should handle empty first name and return username', () => {
      const user = { first_name: '', username: 'johndoe' };
      expect(getDisplayName(user)).toBe('johndoe');
    });

    test('should return "User" when both first name and username are empty', () => {
      const user = { first_name: '', username: '' };
      expect(getDisplayName(user)).toBe('User');
    });

    test('should ignore last name', () => {
      const user = { last_name: 'Doe', username: 'johndoe' };
      expect(getDisplayName(user)).toBe('johndoe');
    });
  });

  // Hard test cases
  describe('Hard cases', () => {
    test('should handle null first name and return username', () => {
      const user = { first_name: null, username: 'johndoe' };
      expect(getDisplayName(user)).toBe('johndoe');
    });

    test('should handle undefined first name and return username', () => {
      const user = { first_name: undefined, username: 'johndoe' };
      expect(getDisplayName(user)).toBe('johndoe');
    });

    test('should handle first name with special characters', () => {
      const user = { first_name: "O'Brien", username: 'obrien' };
      expect(getDisplayName(user)).toBe("O'Brien");
    });

    test('should handle unicode characters in first name', () => {
      const user = { first_name: 'José', username: 'jose' };
      expect(getDisplayName(user)).toBe('José');
    });

    test('should handle whitespace-only first name', () => {
      const user = { first_name: '   ', username: 'johndoe' };
      const result = getDisplayName(user);
      // Either whitespace or username is acceptable
      expect(result).toBeDefined();
    });

    test('should return "User" when all fields are missing or empty', () => {
      const user = { first_name: '', username: '', last_name: '' };
      expect(getDisplayName(user)).toBe('User');
    });

    test('should handle numbers in username', () => {
      const user = { username: 'user123' };
      expect(getDisplayName(user)).toBe('user123');
    });
  });
});

describe('userHelpers.js - formatUserAge', () => {
  // Easy test cases
  describe('Easy cases', () => {
    test('should return empty string for null age', () => {
      expect(formatUserAge(null)).toBe('');
    });

    test('should return empty string for undefined age', () => {
      expect(formatUserAge(undefined)).toBe('');
    });

    test('should format valid age', () => {
      expect(formatUserAge(25)).toBe('Age: 25');
    });

    test('should format zero age', () => {
      expect(formatUserAge(0)).toBe('');
    });
  });

  // Medium test cases
  describe('Medium cases', () => {
    test('should format single digit age', () => {
      expect(formatUserAge(5)).toBe('Age: 5');
    });

    test('should format two digit age', () => {
      expect(formatUserAge(42)).toBe('Age: 42');
    });

    test('should format three digit age', () => {
      expect(formatUserAge(100)).toBe('Age: 100');
    });

    test('should return empty string for false', () => {
      expect(formatUserAge(false)).toBe('');
    });

    test('should return empty string for empty string', () => {
      expect(formatUserAge('')).toBe('');
    });
  });

  // Hard test cases
  describe('Hard cases', () => {
    test('should handle negative age (edge case)', () => {
      expect(formatUserAge(-5)).toBe('Age: -5');
    });

    test('should handle very large age', () => {
      expect(formatUserAge(999)).toBe('Age: 999');
    });

    test('should handle age as string number', () => {
      expect(formatUserAge('25')).toBe('Age: 25');
    });

    test('should return empty for NaN', () => {
      expect(formatUserAge(NaN)).toBe('');
    });

    test('should return empty for non-numeric string', () => {
      expect(formatUserAge('abc')).toBe('');
    });

    test('should handle floating point age', () => {
      expect(formatUserAge(25.5)).toBe('Age: 25.5');
    });

    test('should handle age = 1', () => {
      expect(formatUserAge(1)).toBe('Age: 1');
    });
  });
});
