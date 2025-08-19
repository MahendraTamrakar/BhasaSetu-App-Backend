/**
 * Clean and format output text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
export const cleanOutput = (text) => {
  if (!text) return '';
  
  // Remove excessive newlines (more than 2 consecutive)
  let cleaned = text.replace(/\n{3,}/g, '\n\n');
  
  // Remove excessive spaces and tabs
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  
  // Trim whitespace
  return cleaned.trim();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Remove HTML tags from text
 * @param {string} text - Text containing HTML
 * @returns {string} - Text without HTML tags
 */
export const stripHtml = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
};

/**
 * Normalize whitespace in text
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
export const normalizeWhitespace = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
};