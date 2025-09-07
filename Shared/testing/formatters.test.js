/**
 * Unit Tests for Formatter Utilities
 * Tests for data formatting and presentation functions
 * 
 * @fileoverview Comprehensive test suite for formatter functions
 * @author Master Technology Bar Development Team
 * @version 1.0.0
 * @since 2024
 * 
 * @module FormattersTests
 * @priority MEDIUM - Data presentation functions
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

import { formatPrice, formatIngredients } from '../utils/formatters.js';

describe('Formatters Utils', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleSpy.restore();
  });

  describe('formatPrice', () => {
    it('should format integer prices correctly', () => {
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(50)).toBe('$50.00');
      expect(formatPrice(1)).toBe('$1.00');
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should format decimal prices correctly', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(15.5)).toBe('$15.50');
      expect(formatPrice(0.99)).toBe('$0.99');
      expect(formatPrice(0.01)).toBe('$0.01');
    });

    it('should handle string numbers', () => {
      expect(formatPrice('100')).toBe('$100.00');
      expect(formatPrice('99.99')).toBe('$99.99');
      expect(formatPrice('0.5')).toBe('$0.50');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1000)).toBe('$1,000.00');
      expect(formatPrice(10000)).toBe('$10,000.00');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle custom currency symbols', () => {
      expect(formatPrice(100, '€')).toBe('€100.00');
      expect(formatPrice(50, '£')).toBe('£50.00');
      expect(formatPrice(25, '¥')).toBe('¥25.00');
      expect(formatPrice(75, 'MXN$')).toBe('MXN$75.00');
    });

    it('should handle invalid input gracefully', () => {
      expect(formatPrice(null)).toBe('$0.00');
      expect(formatPrice(undefined)).toBe('$0.00');
      expect(formatPrice('')).toBe('$0.00');
      expect(formatPrice('abc')).toBe('$0.00');
      expect(formatPrice({})).toBe('$0.00');
      expect(formatPrice([])).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatPrice(-100)).toBe('-$100.00');
      expect(formatPrice(-99.99)).toBe('-$99.99');
      expect(formatPrice(-0.01)).toBe('-$0.01');
    });

    it('should handle edge cases', () => {
      expect(formatPrice(Infinity)).toBe('$0.00');
      expect(formatPrice(-Infinity)).toBe('$0.00');
      expect(formatPrice(NaN)).toBe('$0.00');
    });

    it('should round to two decimal places', () => {
      expect(formatPrice(99.999)).toBe('$100.00');
      expect(formatPrice(99.994)).toBe('$99.99');
      expect(formatPrice(0.999)).toBe('$1.00');
      expect(formatPrice(0.001)).toBe('$0.00');
    });

    it('should handle very small numbers', () => {
      expect(formatPrice(0.001)).toBe('$0.00');
      expect(formatPrice(0.004)).toBe('$0.00');
      expect(formatPrice(0.005)).toBe('$0.01');
    });

    it('should handle custom currency with different positions', () => {
      // Test if formatter supports different currency positions
      expect(formatPrice(100, 'USD', 'suffix')).toBe('100.00 USD');
      expect(formatPrice(50, 'EUR', 'prefix')).toBe('EUR 50.00');
    });

    it('should handle locale-specific formatting', () => {
      // Test different locale formatting if supported
      const price = 1234.56;
      const result = formatPrice(price);
      
      // Should contain the price value in some format
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
      expect(result).toContain('4');
    });
  });

  describe('formatIngredients', () => {
    it('should format simple ingredient arrays', () => {
      const ingredients = ['vodka', 'orange juice', 'ice'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('vodka');
      expect(result).toContain('orange juice');
      expect(result).toContain('ice');
    });

    it('should handle single ingredient', () => {
      const ingredients = ['whiskey'];
      const result = formatIngredients(ingredients);
      
      expect(result).toBe('whiskey');
    });

    it('should handle two ingredients', () => {
      const ingredients = ['gin', 'tonic'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('gin');
      expect(result).toContain('tonic');
      expect(result).toContain('and'); // Should use 'and' for two items
    });

    it('should handle multiple ingredients with commas', () => {
      const ingredients = ['rum', 'lime juice', 'sugar', 'mint'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('rum');
      expect(result).toContain('lime juice');
      expect(result).toContain('sugar');
      expect(result).toContain('mint');
      expect(result).toContain(','); // Should use commas for multiple items
    });

    it('should handle empty arrays', () => {
      expect(formatIngredients([])).toBe('');
    });

    it('should handle null or undefined input', () => {
      expect(formatIngredients(null)).toBe('');
      expect(formatIngredients(undefined)).toBe('');
    });

    it('should handle non-array input', () => {
      expect(formatIngredients('vodka')).toBe('');
      expect(formatIngredients(123)).toBe('');
      expect(formatIngredients({})).toBe('');
    });

    it('should handle arrays with non-string elements', () => {
      const ingredients = ['vodka', 123, null, 'juice', undefined];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('vodka');
      expect(result).toContain('juice');
      expect(result).not.toContain('123');
      expect(result).not.toContain('null');
      expect(result).not.toContain('undefined');
    });

    it('should handle arrays with empty strings', () => {
      const ingredients = ['vodka', '', 'juice', '   ', 'lime'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('vodka');
      expect(result).toContain('juice');
      expect(result).toContain('lime');
      expect(result).not.toContain('   ');
    });

    it('should trim whitespace from ingredients', () => {
      const ingredients = ['  vodka  ', ' orange juice ', '\tice\n'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('vodka');
      expect(result).toContain('orange juice');
      expect(result).toContain('ice');
      expect(result).not.toMatch(/\s{2,}/); // No multiple spaces
    });

    it('should handle very long ingredient lists', () => {
      const ingredients = Array.from({ length: 20 }, (_, i) => `ingredient${i + 1}`);
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('ingredient1');
      expect(result).toContain('ingredient20');
      expect(result.split(',').length).toBeGreaterThan(1);
    });

    it('should handle ingredients with special characters', () => {
      const ingredients = ['crème de menthe', 'piña colada mix', 'jalapeño-infused tequila'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('crème de menthe');
      expect(result).toContain('piña colada mix');
      expect(result).toContain('jalapeño-infused tequila');
    });

    it('should handle duplicate ingredients', () => {
      const ingredients = ['vodka', 'juice', 'vodka', 'ice'];
      const result = formatIngredients(ingredients);
      
      // Should handle duplicates appropriately (either include or dedupe)
      expect(result).toContain('vodka');
      expect(result).toContain('juice');
      expect(result).toContain('ice');
    });

    it('should maintain ingredient order', () => {
      const ingredients = ['first', 'second', 'third'];
      const result = formatIngredients(ingredients);
      
      const firstIndex = result.indexOf('first');
      const secondIndex = result.indexOf('second');
      const thirdIndex = result.indexOf('third');
      
      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
    });

    it('should handle custom separators if supported', () => {
      const ingredients = ['vodka', 'juice', 'ice'];
      
      // Test with custom separator if the function supports it
      const resultWithCustomSep = formatIngredients(ingredients, ' | ');
      if (resultWithCustomSep !== formatIngredients(ingredients)) {
        expect(resultWithCustomSep).toContain(' | ');
      }
    });

    it('should handle case sensitivity appropriately', () => {
      const ingredients = ['VODKA', 'Orange Juice', 'ice'];
      const result = formatIngredients(ingredients);
      
      expect(result).toContain('VODKA');
      expect(result).toContain('Orange Juice');
      expect(result).toContain('ice');
    });
  });

  describe('Integration tests', () => {
    it('should work together for cocktail display', () => {
      const price = 12.50;
      const ingredients = ['vodka', 'cranberry juice', 'lime'];
      
      const formattedPrice = formatPrice(price);
      const formattedIngredients = formatIngredients(ingredients);
      
      expect(formattedPrice).toBe('$12.50');
      expect(formattedIngredients).toContain('vodka');
      expect(formattedIngredients).toContain('cranberry juice');
      expect(formattedIngredients).toContain('lime');
    });

    it('should handle edge cases in combination', () => {
      const price = 0;
      const ingredients = [];
      
      const formattedPrice = formatPrice(price);
      const formattedIngredients = formatIngredients(ingredients);
      
      expect(formattedPrice).toBe('$0.00');
      expect(formattedIngredients).toBe('');
    });

    it('should maintain performance with large datasets', () => {
      const startTime = performance.now();
      
      // Format many prices and ingredient lists
      for (let i = 0; i < 1000; i++) {
        formatPrice(Math.random() * 100);
        formatIngredients(['ingredient1', 'ingredient2', 'ingredient3']);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(1000); // 1 second
    });
  });
});

// Export test runner function for manual execution
export async function runFormattersTests() {
  console.log('🧪 Running Formatters Tests...');
  const results = await import('./test-framework.js').then(framework => framework.runTests());
  return results;
}