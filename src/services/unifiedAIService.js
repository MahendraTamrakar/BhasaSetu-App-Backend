import { translateWithGemini } from './geminiService.js';
import { generateSummary, generateKeyPoints } from './summaryService.js';
import { generateAudio as generateTTSAudio } from './ttsService.js';
import { LANGUAGE_VOICE_MAP } from '../config/languages.js';

/**
 * Unified service wrapper that provides a simple API for all AI operations
 */
class UnifiedAIService {
  
  /**
   * Validate if target language is supported
   * @param {string} targetLang - Target language to validate
   * @throws {Error} If language is not supported
   */
  _validateLanguage(targetLang) {
    if (!(targetLang in LANGUAGE_VOICE_MAP)) {
      throw new Error(`Unsupported language: ${targetLang}. Supported: ${Object.keys(LANGUAGE_VOICE_MAP).join(', ')}`);
    }
  }

  /**
   * Validate input text
   * @param {string} text - Text to validate
   * @throws {Error} If text is empty or invalid
   */
  _validateText(text) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      throw new Error('Text is required and must be a non-empty string');
    }
  }

  /**
   * Translate text using Gemini AI with Sarvam fallback
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language for translation
   * @returns {Promise<string>} - Translated text
   */
  async translateText(text, targetLang) {
    try {
      console.log(`[INFO] UnifiedAIService.translateText called for ${targetLang}`);
      
      // Validate inputs
      this._validateText(text);
      this._validateLanguage(targetLang);

      const cleanText = text.trim();
      const cleanTargetLang = targetLang.trim();

      // Use the modified geminiService which has Sarvam fallback
      const translatedText = await translateWithGemini(cleanText, cleanTargetLang);
      
      console.log(`[INFO] UnifiedAIService.translateText completed successfully`);
      return translatedText;

    } catch (error) {
      console.error(`[ERROR] UnifiedAIService.translateText failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate summary using Gemini AI
   * @param {string} text - Text to summarize
   * @param {string} targetLang - Target language for summary
   * @returns {Promise<string>} - Generated summary
   */
  async summarizeText(text, targetLang) {
    try {
      console.log(`[INFO] UnifiedAIService.summarizeText called for ${targetLang}`);
      
      // Validate inputs
      this._validateText(text);
      this._validateLanguage(targetLang);

      const cleanText = text.trim();
      const cleanTargetLang = targetLang.trim();

      const summary = await generateSummary(cleanText, cleanTargetLang);
      
      console.log(`[INFO] UnifiedAIService.summarizeText completed successfully`);
      return summary;

    } catch (error) {
      console.error(`[ERROR] UnifiedAIService.summarizeText failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract key points using Gemini AI
   * @param {string} text - Text to extract key points from
   * @param {string} targetLang - Target language for key points
   * @returns {Promise<string>} - Generated key points
   */
  async extractKeyPoints(text, targetLang) {
    try {
      console.log(`[INFO] UnifiedAIService.extractKeyPoints called for ${targetLang}`);
      
      // Validate inputs
      this._validateText(text);
      this._validateLanguage(targetLang);

      const cleanText = text.trim();
      const cleanTargetLang = targetLang.trim();

      const keyPoints = await generateKeyPoints(cleanText, cleanTargetLang);
      
      console.log(`[INFO] UnifiedAIService.extractKeyPoints completed successfully`);
      return keyPoints;

    } catch (error) {
      console.error(`[ERROR] UnifiedAIService.extractKeyPoints failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate audio using Google TTS with Sarvam fallback
   * @param {string} text - Text to convert to speech
   * @param {string} lang - Language for TTS
   * @returns {Promise<string>} - Generated audio filename
   */
  async generateAudio(text, lang) {
    try {
      console.log(`[INFO] UnifiedAIService.generateAudio called for ${lang}`);
      
      // Validate inputs
      this._validateText(text);
      this._validateLanguage(lang);

      const cleanText = text.trim();
      const cleanLang = lang.trim();

      // Use the modified ttsService which has Sarvam fallback
      const audioFilename = await generateTTSAudio(cleanText, cleanLang);
      
      console.log(`[INFO] UnifiedAIService.generateAudio completed successfully`);
      return audioFilename;

    } catch (error) {
      console.error(`[ERROR] UnifiedAIService.generateAudio failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get list of supported languages
   * @returns {Array<string>} - Array of supported language names
   */
  getSupportedLanguages() {
    return Object.keys(LANGUAGE_VOICE_MAP);
  }

  /**
   * Check if a language is supported
   * @param {string} lang - Language to check
   * @returns {boolean} - True if language is supported
   */
  isLanguageSupported(lang) {
    return lang in LANGUAGE_VOICE_MAP;
  }
}

// Export singleton instance
export const aiService = new UnifiedAIService();

// Export class for testing purposes
export { UnifiedAIService };

// Export individual methods for backward compatibility
export const {
  translateText,
  summarizeText,
  extractKeyPoints,
  generateAudio
} = aiService;