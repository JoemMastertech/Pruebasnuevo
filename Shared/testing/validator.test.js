/**
 * Unit Tests for Validator Utilities
 * Critical validation tests for data integrity and security
 * 
 * @fileoverview Comprehensive test suite for validator functions
 * @author Master Technology Bar Development Team
 * @version 1.0.0
 * @since 2024
 * 
 * @module ValidatorTests
 * @priority HIGH - Data validation functions
 */

import { 
  describe, 
  it, 
  expect, 
  beforeEach, 
  afterEach, 
  createMock, 
  spyOn 
} from './test-framework.js';

import Validator from './validator.js';

describe('Validator Utils', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleSpy.restore();
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com',
        'email@123.123.123.123', // IP address
        'user@domain-name.com'
      ];
      
      validEmails.forEach(email => {
        expect(Validator.isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing@domain',
        'spaces @domain.com',
        'user@domain .com',
        'user@domain..com',
        'user@@domain.com',
        'user@domain@domain.com',
        '.user@domain.com',
        'user.@domain.com',
        'user@domain.com.',
        'user@-domain.com',
        'user@domain-.com'
      ];
      
      invalidEmails.forEach(email => {
        expect(Validator.isValidEmail(email)).toBe(false);
      });
    });

    it('should handle empty or null input', () => {
      expect(Validator.isValidEmail('')).toBe(false);
      expect(Validator.isValidEmail(null)).toBe(false);
      expect(Validator.isValidEmail(undefined)).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(Validator.isValidEmail(123)).toBe(false);
      expect(Validator.isValidEmail({})).toBe(false);
      expect(Validator.isValidEmail([])).toBe(false);
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      expect(Validator.isValidEmail(longEmail)).toBe(false);
    });

    it('should handle emails with special characters', () => {
      const specialEmails = [
        'user+tag@example.com', // Plus sign
        'user.name@example.com', // Dot in local part
        'user_name@example.com', // Underscore
        'user-name@example.com'  // Hyphen
      ];
      
      specialEmails.forEach(email => {
        expect(Validator.isValidEmail(email)).toBe(true);
      });
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone formats', () => {
      const validPhones = [
        '+1234567890',
        '+52 55 1234 5678',
        '+52-55-1234-5678',
        '+52 (55) 1234-5678',
        '5551234567',
        '555-123-4567',
        '(555) 123-4567',
        '+1 (555) 123-4567'
      ];
      
      validPhones.forEach(phone => {
        expect(Validator.isValidPhone(phone)).toBe(true);
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '123', // Too short
        'abc-def-ghij', // Letters
        '555-123-456', // Too short
        '555-123-45678', // Too long for format
        '+', // Just plus sign
        '++1234567890', // Double plus
        '123-456-789a', // Letter at end
        '(555 123-4567', // Missing closing parenthesis
        '555) 123-4567', // Missing opening parenthesis
        '555--123-4567' // Double hyphen
      ];
      
      invalidPhones.forEach(phone => {
        expect(Validator.isValidPhone(phone)).toBe(false);
      });
    });

    it('should handle empty or null input', () => {
      expect(Validator.isValidPhone('')).toBe(false);
      expect(Validator.isValidPhone(null)).toBe(false);
      expect(Validator.isValidPhone(undefined)).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(Validator.isValidPhone(1234567890)).toBe(false);
      expect(Validator.isValidPhone({})).toBe(false);
      expect(Validator.isValidPhone([])).toBe(false);
    });

    it('should handle international formats', () => {
      const internationalPhones = [
        '+44 20 7946 0958', // UK
        '+33 1 42 86 83 26', // France
        '+49 30 12345678', // Germany
        '+81 3 1234 5678', // Japan
        '+86 138 0013 8000' // China
      ];
      
      internationalPhones.forEach(phone => {
        expect(Validator.isValidPhone(phone)).toBe(true);
      });
    });
  });

  describe('isPositiveNumber', () => {
    it('should validate positive numbers', () => {
      const positiveNumbers = [1, 5, 10, 100, 0.1, 0.01, 999.99, 1000000];
      
      positiveNumbers.forEach(num => {
        expect(Validator.isPositiveNumber(num)).toBe(true);
      });
    });

    it('should reject negative numbers and zero', () => {
      const invalidNumbers = [-1, -5, -0.1, 0, -999.99, -1000000];
      
      invalidNumbers.forEach(num => {
        expect(Validator.isPositiveNumber(num)).toBe(false);
      });
    });

    it('should handle string numbers', () => {
      expect(Validator.isPositiveNumber('5')).toBe(true);
      expect(Validator.isPositiveNumber('0.5')).toBe(true);
      expect(Validator.isPositiveNumber('-5')).toBe(false);
      expect(Validator.isPositiveNumber('0')).toBe(false);
    });

    it('should reject non-numeric input', () => {
      const nonNumeric = ['abc', 'five', '5a', 'a5', '', null, undefined, {}, []];
      
      nonNumeric.forEach(input => {
        expect(Validator.isPositiveNumber(input)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(Validator.isPositiveNumber(Infinity)).toBe(false);
      expect(Validator.isPositiveNumber(-Infinity)).toBe(false);
      expect(Validator.isPositiveNumber(NaN)).toBe(false);
    });

    it('should handle very large numbers', () => {
      expect(Validator.isPositiveNumber(Number.MAX_VALUE)).toBe(true);
      expect(Validator.isPositiveNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('should handle very small positive numbers', () => {
      expect(Validator.isPositiveNumber(Number.MIN_VALUE)).toBe(true);
      expect(Validator.isPositiveNumber(0.000001)).toBe(true);
    });
  });

  describe('isValidLength', () => {
    it('should validate text within length limits', () => {
      expect(Validator.isValidLength('hello', 1, 10)).toBe(true);
      expect(Validator.isValidLength('test', 4, 4)).toBe(true);
      expect(Validator.isValidLength('a', 1, 100)).toBe(true);
      expect(Validator.isValidLength('medium text', 5, 20)).toBe(true);
    });

    it('should reject text outside length limits', () => {
      expect(Validator.isValidLength('', 1, 10)).toBe(false); // Too short
      expect(Validator.isValidLength('very long text here', 1, 10)).toBe(false); // Too long
      expect(Validator.isValidLength('test', 5, 10)).toBe(false); // Below minimum
      expect(Validator.isValidLength('test', 1, 3)).toBe(false); // Above maximum
    });

    it('should handle edge cases for length', () => {
      expect(Validator.isValidLength('test', 4, 4)).toBe(true); // Exact match
      expect(Validator.isValidLength('', 0, 5)).toBe(true); // Empty string with min 0
      expect(Validator.isValidLength('a', 1, 1)).toBe(true); // Single character
    });

    it('should handle invalid parameters', () => {
      expect(Validator.isValidLength('test', -1, 10)).toBe(false); // Negative min
      expect(Validator.isValidLength('test', 10, 5)).toBe(false); // Min > Max
      expect(Validator.isValidLength('test', 'a', 10)).toBe(false); // Non-numeric min
      expect(Validator.isValidLength('test', 1, 'b')).toBe(false); // Non-numeric max
    });

    it('should handle non-string input', () => {
      expect(Validator.isValidLength(123, 1, 10)).toBe(false);
      expect(Validator.isValidLength(null, 1, 10)).toBe(false);
      expect(Validator.isValidLength(undefined, 1, 10)).toBe(false);
      expect(Validator.isValidLength({}, 1, 10)).toBe(false);
      expect(Validator.isValidLength([], 1, 10)).toBe(false);
    });

    it('should handle unicode characters', () => {
      expect(Validator.isValidLength('café', 4, 4)).toBe(true);
      expect(Validator.isValidLength('🎉🎊', 2, 2)).toBe(true);
      expect(Validator.isValidLength('测试', 2, 2)).toBe(true);
    });

    it('should handle whitespace', () => {
      expect(Validator.isValidLength('  test  ', 8, 8)).toBe(true);
      expect(Validator.isValidLength('\t\n', 2, 2)).toBe(true);
      expect(Validator.isValidLength(' ', 1, 1)).toBe(true);
    });
  });

  describe('Validator static methods integration', () => {
    it('should maintain consistent validation across calls', () => {
      const email = 'test@example.com';
      expect(Validator.isValidEmail(email)).toBe(Validator.isValidEmail(email));
    });

    it('should handle method chaining scenarios', () => {
      const email = 'test@example.com';
      const phone = '+1234567890';
      const number = 5;
      const text = 'hello';
      
      const emailValid = Validator.isValidEmail(email);
      const phoneValid = Validator.isValidPhone(phone);
      const numberValid = Validator.isPositiveNumber(number);
      const lengthValid = Validator.isValidLength(text, 1, 10);
      
      expect(emailValid && phoneValid && numberValid && lengthValid).toBe(true);
    });
  });

  describe('Error handling and logging', () => {
    it('should handle validation errors gracefully', () => {
      // Test with inputs that might cause errors
      const problematicInputs = [
        { method: 'isValidEmail', input: Symbol('test') },
        { method: 'isValidPhone', input: new Date() },
        { method: 'isPositiveNumber', input: function() {} },
        { method: 'isValidLength', input: new RegExp('test'), min: 1, max: 10 }
      ];
      
      problematicInputs.forEach(({ method, input, min, max }) => {
        let result;
        if (method === 'isValidLength') {
          result = Validator[method](input, min, max);
        } else {
          result = Validator[method](input);
        }
        
        expect(result).toBe(false);
      });
    });
  });
});

// Export test runner function for manual execution
export async function runValidatorTests() {
  console.log('🧪 Running Validator Tests...');
  const results = await import('./test-framework.js').then(framework => framework.runTests());
  return results;
}