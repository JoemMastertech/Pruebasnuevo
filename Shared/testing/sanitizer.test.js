/**
 * Unit Tests for Sanitizer Utilities
 * Critical security tests for XSS prevention and input sanitization
 * 
 * @fileoverview Comprehensive test suite for sanitizer functions
 * @author Master Technology Bar Development Team
 * @version 1.0.0
 * @since 2024
 * 
 * @module SanitizerTests
 * @priority CRITICAL - Security functions
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

import { sanitizeHTML, sanitizeText, sanitizeURL } from '../utils/sanitizer.js';

// Mock DOMPurify for testing
function setupDOMPurifyMock() {
  window.DOMPurify = {
    sanitize: createMock((html, options) => {
      // Simple mock implementation for testing
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                .replace(/on\w+="[^"]*"/gi, '');
    })
  };
}

function cleanupDOMPurifyMock() {
  delete window.DOMPurify;
}

describe('Sanitizer Utils', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
    setupDOMPurifyMock();
  });
  
  afterEach(() => {
    consoleSpy.restore();
    cleanupDOMPurifyMock();
  });

  describe('sanitizeHTML', () => {
    it('should remove script tags from HTML', () => {
      const maliciousHTML = '<p>Safe content</p><script>alert("XSS")</script>';
      const result = sanitizeHTML(maliciousHTML);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('Safe content');
    });

    it('should remove iframe tags', () => {
      const maliciousHTML = '<p>Content</p><iframe src="evil.com"></iframe>';
      const result = sanitizeHTML(maliciousHTML);
      
      expect(result).not.toContain('<iframe>');
      expect(result).not.toContain('evil.com');
      expect(result).toContain('Content');
    });

    it('should remove event handlers', () => {
      const maliciousHTML = '<div onclick="alert(1)">Click me</div>';
      const result = sanitizeHTML(maliciousHTML);
      
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert(1)');
      expect(result).toContain('Click me');
    });

    it('should preserve safe HTML tags', () => {
      const safeHTML = '<p><strong>Bold</strong> and <em>italic</em> text</p>';
      const result = sanitizeHTML(safeHTML);
      
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
      expect(result).toContain('Bold');
      expect(result).toContain('italic');
    });

    it('should handle empty or null input', () => {
      expect(sanitizeHTML('')).toBe('');
      expect(sanitizeHTML(null)).toBe('');
      expect(sanitizeHTML(undefined)).toBe('');
    });

    it('should handle non-string input', () => {
      expect(sanitizeHTML(123)).toBe('');
      expect(sanitizeHTML({})).toBe('');
      expect(sanitizeHTML([])).toBe('');
    });

    it('should respect custom options', () => {
      const html = '<p>Text</p><div>More text</div>';
      const options = { ALLOWED_TAGS: ['p'] };
      
      sanitizeHTML(html, options);
      
      expect(window.DOMPurify.sanitize.callCount).toBe(1);
      expect(window.DOMPurify.sanitize.calls[0][1]).toEqual(
        expect.objectContaining({ ALLOWED_TAGS: ['p'] })
      );
    });

    it('should handle DOMPurify not available', () => {
      delete window.DOMPurify;
      
      const result = sanitizeHTML('<p>Test</p>');
      
      expect(result).toBe('');
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle DOMPurify errors gracefully', () => {
      window.DOMPurify.sanitize.mockImplementation(() => {
        throw new Error('DOMPurify error');
      });
      
      const result = sanitizeHTML('<p>Test</p>');
      
      expect(result).toBe('');
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle very long HTML input', () => {
      const longHTML = '<p>' + 'a'.repeat(15000) + '</p>';
      const result = sanitizeHTML(longHTML);
      
      // Should handle long input gracefully
      expect(result).toBe('');
    });
  });

  describe('sanitizeText', () => {
    it('should remove dangerous characters', () => {
      const dangerousText = 'Hello <script>alert(1)</script> World';
      const result = sanitizeText(dangerousText);
      
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('script');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should remove quotes and ampersands', () => {
      const text = 'Text with "quotes" and \'apostrophes\' & ampersands';
      const result = sanitizeText(text);
      
      expect(result).not.toContain('"');
      expect(result).not.toContain("'");
      expect(result).not.toContain('&');
      expect(result).toContain('Text with');
      expect(result).toContain('quotes');
    });

    it('should respect max length', () => {
      const longText = 'a'.repeat(2000);
      const result = sanitizeText(longText, 100);
      
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should trim whitespace', () => {
      const text = '   Hello World   ';
      const result = sanitizeText(text);
      
      expect(result).toBe('Hello World');
      expect(result).not.toMatch(/^\s/);
      expect(result).not.toMatch(/\s$/);
    });

    it('should handle empty or null input', () => {
      expect(sanitizeText('')).toBe('');
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
    });

    it('should handle non-string input', () => {
      expect(sanitizeText(123)).toBe('');
      expect(sanitizeText({})).toBe('');
      expect(sanitizeText([])).toBe('');
    });

    it('should use default max length', () => {
      const longText = 'a'.repeat(1500);
      const result = sanitizeText(longText);
      
      expect(result.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('sanitizeURL', () => {
    it('should allow valid HTTP URLs', () => {
      const url = 'http://example.com/path';
      const result = sanitizeURL(url);
      
      expect(result).toBe(url);
    });

    it('should allow valid HTTPS URLs', () => {
      const url = 'https://secure.example.com/path';
      const result = sanitizeURL(url);
      
      expect(result).toBe(url);
    });

    it('should reject javascript: URLs', () => {
      const maliciousURL = 'javascript:alert(1)';
      const result = sanitizeURL(maliciousURL);
      
      expect(result).toBe('');
    });

    it('should reject data: URLs', () => {
      const dataURL = 'data:text/html,<script>alert(1)</script>';
      const result = sanitizeURL(dataURL);
      
      expect(result).toBe('');
    });

    it('should handle very long URLs', () => {
      const longURL = 'http://example.com/' + 'a'.repeat(3000);
      const result = sanitizeURL(longURL);
      
      expect(result).toBe('');
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle empty or null input', () => {
      expect(sanitizeURL('')).toBe('');
      expect(sanitizeURL(null)).toBe('');
      expect(sanitizeURL(undefined)).toBe('');
    });

    it('should handle non-string input', () => {
      expect(sanitizeURL(123)).toBe('');
      expect(sanitizeURL({})).toBe('');
      expect(sanitizeURL([])).toBe('');
    });

    it('should allow relative URLs', () => {
      const relativeURL = '/path/to/resource';
      const result = sanitizeURL(relativeURL);
      
      expect(result).toBe(relativeURL);
    });

    it('should handle URLs with query parameters', () => {
      const urlWithQuery = 'https://example.com/search?q=test&page=1';
      const result = sanitizeURL(urlWithQuery);
      
      expect(result).toBe(urlWithQuery);
    });

    it('should handle URLs with fragments', () => {
      const urlWithFragment = 'https://example.com/page#section';
      const result = sanitizeURL(urlWithFragment);
      
      expect(result).toBe(urlWithFragment);
    });
  });
});

// Export test runner function for manual execution
export async function runSanitizerTests() {
  console.log('🧪 Running Sanitizer Security Tests...');
  const results = await import('./test-framework.js').then(framework => framework.runTests());
  return results;
}