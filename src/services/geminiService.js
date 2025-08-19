import { model } from '../config/gemini.js';
import { cleanOutput } from '../utils/textUtils.js';

/**
 * Translate text using Google Gemini AI
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language
 * @returns {Promise<string>} - Translated text
 */
export const translateWithGemini = async (text, targetLang) => {
  try {
    const prompt = `Translate the following text into ${targetLang}. 
    Provide only the translated text without any additional commentary or explanations.
    
    Text to translate:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return cleanOutput(translatedText);
  } catch (error) {
    console.error(`[ERROR] Gemini translation failed: ${error.message}`);
    throw new Error(`Translation failed: ${error.message}`);
  }
};