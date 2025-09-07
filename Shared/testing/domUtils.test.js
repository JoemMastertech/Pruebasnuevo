/**
 * Unit Tests for DOM Utilities
 * Critical tests for DOM manipulation and UI interaction functions
 * 
 * @fileoverview Comprehensive test suite for DOM utility functions
 * @author Master Technology Bar Development Team
 * @version 1.0.0
 * @since 2024
 * 
 * @module DOMUtilsTests
 * @priority HIGH - DOM manipulation functions
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

import { 
  setSafeInnerHTML, 
  createElement, 
  addClass, 
  removeClass, 
  toggleClass, 
  setAttributes, 
  getElement, 
  getAllElements, 
  removeElement, 
  showElement, 
  hideElement, 
  isElementVisible 
} from '../utils/domUtils.js';

describe('DOM Utils', () => {
  let testContainer;
  let consoleSpy;
  
  beforeEach(() => {
    // Create a test container for DOM manipulation
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);
    
    consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Clean up test container
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }
    consoleSpy.restore();
  });

  describe('setSafeInnerHTML', () => {
    it('should set safe HTML content', () => {
      const element = document.createElement('div');
      const safeHTML = '<p>Safe content</p>';
      
      setSafeInnerHTML(element, safeHTML);
      
      expect(element.innerHTML).toContain('Safe content');
      expect(element.innerHTML).toContain('<p>');
    });

    it('should sanitize dangerous HTML', () => {
      const element = document.createElement('div');
      const dangerousHTML = '<p>Safe</p><script>alert("XSS")</script>';
      
      setSafeInnerHTML(element, dangerousHTML);
      
      expect(element.innerHTML).toContain('Safe');
      expect(element.innerHTML).not.toContain('<script>');
      expect(element.innerHTML).not.toContain('alert');
    });

    it('should handle null or undefined elements', () => {
      expect(() => setSafeInnerHTML(null, '<p>Test</p>')).not.toThrow();
      expect(() => setSafeInnerHTML(undefined, '<p>Test</p>')).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle empty or null HTML', () => {
      const element = document.createElement('div');
      element.innerHTML = 'existing content';
      
      setSafeInnerHTML(element, '');
      expect(element.innerHTML).toBe('');
      
      setSafeInnerHTML(element, null);
      expect(element.innerHTML).toBe('');
    });

    it('should preserve safe attributes', () => {
      const element = document.createElement('div');
      const htmlWithAttributes = '<p class="safe-class" id="safe-id">Content</p>';
      
      setSafeInnerHTML(element, htmlWithAttributes);
      
      const paragraph = element.querySelector('p');
      expect(paragraph).toBeTruthy();
      expect(paragraph.className).toContain('safe-class');
      expect(paragraph.id).toBe('safe-id');
    });

    it('should remove dangerous attributes', () => {
      const element = document.createElement('div');
      const dangerousHTML = '<div onclick="alert(1)" onload="evil()">Content</div>';
      
      setSafeInnerHTML(element, dangerousHTML);
      
      const div = element.querySelector('div');
      expect(div).toBeTruthy();
      expect(div.getAttribute('onclick')).toBeFalsy();
      expect(div.getAttribute('onload')).toBeFalsy();
    });
  });

  describe('createElement', () => {
    it('should create elements with tag name', () => {
      const element = createElement('div');
      
      expect(element.tagName.toLowerCase()).toBe('div');
      expect(element.nodeType).toBe(Node.ELEMENT_NODE);
    });

    it('should create elements with attributes', () => {
      const attributes = { id: 'test-id', class: 'test-class', 'data-value': '123' };
      const element = createElement('span', attributes);
      
      expect(element.tagName.toLowerCase()).toBe('span');
      expect(element.id).toBe('test-id');
      expect(element.className).toBe('test-class');
      expect(element.getAttribute('data-value')).toBe('123');
    });

    it('should create elements with content', () => {
      const element = createElement('p', {}, 'Test content');
      
      expect(element.tagName.toLowerCase()).toBe('p');
      expect(element.textContent).toBe('Test content');
    });

    it('should create elements with HTML content', () => {
      const element = createElement('div', {}, '<strong>Bold text</strong>');
      
      expect(element.innerHTML).toContain('<strong>');
      expect(element.innerHTML).toContain('Bold text');
    });

    it('should handle invalid tag names', () => {
      expect(() => createElement('')).not.toThrow();
      expect(() => createElement(null)).not.toThrow();
      expect(() => createElement(undefined)).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle invalid attributes', () => {
      const element = createElement('div', null, 'Content');
      expect(element.textContent).toBe('Content');
      
      const element2 = createElement('div', 'invalid', 'Content');
      expect(element2.textContent).toBe('Content');
    });
  });

  describe('addClass', () => {
    it('should add single class to element', () => {
      const element = document.createElement('div');
      
      addClass(element, 'test-class');
      
      expect(element.classList.contains('test-class')).toBe(true);
    });

    it('should add multiple classes to element', () => {
      const element = document.createElement('div');
      
      addClass(element, 'class1 class2 class3');
      
      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(true);
      expect(element.classList.contains('class3')).toBe(true);
    });

    it('should not duplicate existing classes', () => {
      const element = document.createElement('div');
      element.className = 'existing-class';
      
      addClass(element, 'existing-class new-class');
      
      expect(element.classList.contains('existing-class')).toBe(true);
      expect(element.classList.contains('new-class')).toBe(true);
      expect(element.className.split(' ').filter(c => c === 'existing-class').length).toBe(1);
    });

    it('should handle null or undefined elements', () => {
      expect(() => addClass(null, 'test-class')).not.toThrow();
      expect(() => addClass(undefined, 'test-class')).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle empty or null class names', () => {
      const element = document.createElement('div');
      
      expect(() => addClass(element, '')).not.toThrow();
      expect(() => addClass(element, null)).not.toThrow();
      expect(() => addClass(element, undefined)).not.toThrow();
    });
  });

  describe('removeClass', () => {
    it('should remove single class from element', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2 class3';
      
      removeClass(element, 'class2');
      
      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(false);
      expect(element.classList.contains('class3')).toBe(true);
    });

    it('should remove multiple classes from element', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2 class3 class4';
      
      removeClass(element, 'class2 class4');
      
      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(false);
      expect(element.classList.contains('class3')).toBe(true);
      expect(element.classList.contains('class4')).toBe(false);
    });

    it('should handle non-existent classes gracefully', () => {
      const element = document.createElement('div');
      element.className = 'existing-class';
      
      expect(() => removeClass(element, 'non-existent-class')).not.toThrow();
      expect(element.classList.contains('existing-class')).toBe(true);
    });

    it('should handle null or undefined elements', () => {
      expect(() => removeClass(null, 'test-class')).not.toThrow();
      expect(() => removeClass(undefined, 'test-class')).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });
  });

  describe('toggleClass', () => {
    it('should add class if not present', () => {
      const element = document.createElement('div');
      
      toggleClass(element, 'test-class');
      
      expect(element.classList.contains('test-class')).toBe(true);
    });

    it('should remove class if present', () => {
      const element = document.createElement('div');
      element.className = 'test-class';
      
      toggleClass(element, 'test-class');
      
      expect(element.classList.contains('test-class')).toBe(false);
    });

    it('should return true when class is added', () => {
      const element = document.createElement('div');
      
      const result = toggleClass(element, 'test-class');
      
      expect(result).toBe(true);
      expect(element.classList.contains('test-class')).toBe(true);
    });

    it('should return false when class is removed', () => {
      const element = document.createElement('div');
      element.className = 'test-class';
      
      const result = toggleClass(element, 'test-class');
      
      expect(result).toBe(false);
      expect(element.classList.contains('test-class')).toBe(false);
    });

    it('should handle null or undefined elements', () => {
      expect(() => toggleClass(null, 'test-class')).not.toThrow();
      expect(() => toggleClass(undefined, 'test-class')).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });
  });

  describe('setAttributes', () => {
    it('should set single attribute', () => {
      const element = document.createElement('div');
      
      setAttributes(element, { id: 'test-id' });
      
      expect(element.id).toBe('test-id');
    });

    it('should set multiple attributes', () => {
      const element = document.createElement('div');
      const attributes = {
        id: 'test-id',
        class: 'test-class',
        'data-value': '123',
        title: 'Test title'
      };
      
      setAttributes(element, attributes);
      
      expect(element.id).toBe('test-id');
      expect(element.className).toBe('test-class');
      expect(element.getAttribute('data-value')).toBe('123');
      expect(element.title).toBe('Test title');
    });

    it('should handle null or undefined elements', () => {
      expect(() => setAttributes(null, { id: 'test' })).not.toThrow();
      expect(() => setAttributes(undefined, { id: 'test' })).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });

    it('should handle null or undefined attributes', () => {
      const element = document.createElement('div');
      
      expect(() => setAttributes(element, null)).not.toThrow();
      expect(() => setAttributes(element, undefined)).not.toThrow();
    });
  });

  describe('getElement', () => {
    beforeEach(() => {
      testContainer.innerHTML = `
        <div id="test-element" class="test-class">Test content</div>
        <span class="another-class">Another element</span>
      `;
    });

    it('should get element by ID', () => {
      const element = getElement('#test-element');
      
      expect(element).toBeTruthy();
      expect(element.id).toBe('test-element');
    });

    it('should get element by class', () => {
      const element = getElement('.test-class');
      
      expect(element).toBeTruthy();
      expect(element.classList.contains('test-class')).toBe(true);
    });

    it('should get element by tag name', () => {
      const element = getElement('span');
      
      expect(element).toBeTruthy();
      expect(element.tagName.toLowerCase()).toBe('span');
    });

    it('should return null for non-existent elements', () => {
      const element = getElement('#non-existent');
      
      expect(element).toBe(null);
    });

    it('should handle invalid selectors', () => {
      expect(() => getElement('')).not.toThrow();
      expect(() => getElement(null)).not.toThrow();
      expect(() => getElement(undefined)).not.toThrow();
    });
  });

  describe('getAllElements', () => {
    beforeEach(() => {
      testContainer.innerHTML = `
        <div class="test-class">Element 1</div>
        <div class="test-class">Element 2</div>
        <span class="test-class">Element 3</span>
      `;
    });

    it('should get all elements by class', () => {
      const elements = getAllElements('.test-class');
      
      expect(elements.length).toBe(3);
      expect(elements[0].textContent).toBe('Element 1');
      expect(elements[1].textContent).toBe('Element 2');
      expect(elements[2].textContent).toBe('Element 3');
    });

    it('should get all elements by tag name', () => {
      const elements = getAllElements('div');
      
      expect(elements.length).toBe(2);
      expect(elements[0].tagName.toLowerCase()).toBe('div');
      expect(elements[1].tagName.toLowerCase()).toBe('div');
    });

    it('should return empty array for non-existent elements', () => {
      const elements = getAllElements('.non-existent');
      
      expect(elements).toEqual([]);
    });

    it('should handle invalid selectors', () => {
      expect(() => getAllElements('')).not.toThrow();
      expect(() => getAllElements(null)).not.toThrow();
      expect(() => getAllElements(undefined)).not.toThrow();
    });
  });

  describe('removeElement', () => {
    it('should remove element from DOM', () => {
      const element = document.createElement('div');
      element.id = 'to-remove';
      testContainer.appendChild(element);
      
      expect(document.getElementById('to-remove')).toBeTruthy();
      
      removeElement(element);
      
      expect(document.getElementById('to-remove')).toBe(null);
    });

    it('should handle elements not in DOM', () => {
      const element = document.createElement('div');
      
      expect(() => removeElement(element)).not.toThrow();
    });

    it('should handle null or undefined elements', () => {
      expect(() => removeElement(null)).not.toThrow();
      expect(() => removeElement(undefined)).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });
  });

  describe('showElement and hideElement', () => {
    it('should show hidden element', () => {
      const element = document.createElement('div');
      element.style.display = 'none';
      testContainer.appendChild(element);
      
      showElement(element);
      
      expect(element.style.display).not.toBe('none');
    });

    it('should hide visible element', () => {
      const element = document.createElement('div');
      testContainer.appendChild(element);
      
      hideElement(element);
      
      expect(element.style.display).toBe('none');
    });

    it('should handle null or undefined elements', () => {
      expect(() => showElement(null)).not.toThrow();
      expect(() => hideElement(null)).not.toThrow();
      expect(() => showElement(undefined)).not.toThrow();
      expect(() => hideElement(undefined)).not.toThrow();
      expect(consoleSpy.callCount).toBeGreaterThan(0);
    });
  });

  describe('isElementVisible', () => {
    it('should return true for visible elements', () => {
      const element = document.createElement('div');
      testContainer.appendChild(element);
      
      expect(isElementVisible(element)).toBe(true);
    });

    it('should return false for hidden elements', () => {
      const element = document.createElement('div');
      element.style.display = 'none';
      testContainer.appendChild(element);
      
      expect(isElementVisible(element)).toBe(false);
    });

    it('should return false for elements not in DOM', () => {
      const element = document.createElement('div');
      
      expect(isElementVisible(element)).toBe(false);
    });

    it('should handle null or undefined elements', () => {
      expect(isElementVisible(null)).toBe(false);
      expect(isElementVisible(undefined)).toBe(false);
    });
  });
});

// Export test runner function for manual execution
export async function runDOMUtilsTests() {
  console.log('🧪 Running DOM Utils Tests...');
  const results = await import('./test-framework.js').then(framework => framework.runTests());
  return results;
}