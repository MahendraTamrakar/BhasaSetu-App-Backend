import { describe, test, expect } from '@jest/globals';
import { cleanOutput, truncateText, stripHtml, normalizeWhitespace } from '../src/utils/textUtils.js';

describe('Text Utils', () => {
  describe('cleanOutput', () => {
    test('should remove excessive newlines', () => {
      const input = 'Line 1\n\n\n\nLine 2\n\n\n\n\nLine 3';
      const expected = 'Line 1\n\nLine 2\n\nLine 3';
      expect(cleanOutput(input)).toBe(expected);
    });

    test('should remove excessive spaces', () => {
      const input = 'Word1     Word2\t\t\tWord3';
      const expected = 'Word1 Word2 Word3';
      expect(cleanOutput(input)).toBe(expected);
    });

    test('should trim whitespace', () => {
      const input = '  \n  Text with whitespace  \n  ';
      const expected = 'Text with whitespace';
      expect(cleanOutput(input)).toBe(expected);
    });

    test('should handle empty or null input', () => {
      expect(cleanOutput('')).toBe('');
      expect(cleanOutput(null)).toBe('');
      expect(cleanOutput(undefined)).toBe('');
    });
  });

  describe('truncateText', () => {
    test('should truncate long text', () => {
      const input = 'This is a very long text that needs to be truncated';
      const result = truncateText(input, 20);
      expect(result).toBe('This is a very lo...');
      expect(result.length).toBe(20);
    });

    test('should not truncate short text', () => {
      const input = 'Short text';
      expect(truncateText(input, 20)).toBe(input);
    });

    test('should use custom suffix', () => {
      const input = 'Long text here';
      const result = truncateText(input, 10, '***');
      expect(result).toBe('Long t***');
    });
  });

  describe('stripHtml', () => {
    test('should remove HTML tags', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      const expected = 'Hello world!';
      expect(stripHtml(input)).toBe(expected);
    });

    test('should handle text without HTML', () => {
      const input = 'Plain text';
      expect(stripHtml(input)).toBe(input);
    });

    test('should handle empty input', () => {
      expect(stripHtml('')).toBe('');
      expect(stripHtml(null)).toBe('');
    });
  });

  describe('normalizeWhitespace', () => {
    test('should normalize multiple spaces', () => {
      const input = 'Text   with    multiple     spaces';
      const expected = 'Text with multiple spaces';
      expect(normalizeWhitespace(input)).toBe(expected);
    });

    test('should normalize tabs and newlines', () => {
      const input = 'Text\t\twith\n\ntabs\rand\nnewlines';
      const expected = 'Text with tabs and newlines';
      expect(normalizeWhitespace(input)).toBe(expected);
    });
  });
});