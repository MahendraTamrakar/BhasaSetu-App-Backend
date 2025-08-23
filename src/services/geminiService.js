import { model } from '../config/gemini.js';
import { cleanOutput } from '../utils/textUtils.js';

// Sarvam language code mapping
const SARVAM_LANGUAGE_MAP = {
  "Hindi": "hi-IN",
  "Tamil": "ta-IN", 
  "Marathi": "mr-IN",
  "Gujarati": "gu-IN",
  "Punjabi": "pa-IN",
  "Bengali": "bn-IN",
  "Telugu": "te-IN",
  "Kannada": "kn-IN",
  "Malayalam": "ml-IN",
  "English": "en-IN",
};

/**
 * Translate text using Sarvam Translate API as fallback
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language
 * @returns {Promise<string>} - Translated text
 */
const translateWithSarvam = async (text, targetLang) => {
  try {
    if (!process.env.SARVAM_API_KEY) {
      throw new Error('SARVAM_API_KEY not set in environment variables');
    }

    const sarvamLangCode = SARVAM_LANGUAGE_MAP[targetLang];
    if (!sarvamLangCode) {
      throw new Error(`Sarvam API does not support language: ${targetLang}`);
    }

    console.log(`[INFO] Using Sarvam Translate API for ${targetLang}`);

    const response = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Subscription-Key': process.env.SARVAM_API_KEY
      },
      body: JSON.stringify({
        input: text,
        source_language_code: "auto-detect",
        target_language_code: sarvamLangCode,
        speaker_gender: "Female",
        mode: "formal",
        model: "sarvam-translate:v1"
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Sarvam API error (${response.status}): ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.translated_text) {
      throw new Error('No translated text returned from Sarvam API');
    }

    return cleanOutput(data.translated_text);
  } catch (error) {
    console.error(`[ERROR] Sarvam translation failed: ${error.message}`);
    throw new Error(`Sarvam translation failed: ${error.message}`);
  }
};

/**
 * Translate text using Google Gemini AI with Sarvam fallback
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language
 * @returns {Promise<string>} - Translated text
 */
export const translateWithGemini = async (text, targetLang) => {
  try {
    console.log(`[INFO] Attempting translation with Gemini AI for ${targetLang}`);
    
    const prompt = `Translate the following text into ${targetLang}. 
    Provide only the translated text without any additional commentary or explanations.
    
    Text to translate:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    console.log(`[INFO] Gemini translation successful for ${targetLang}`);
    return cleanOutput(translatedText);
  } catch (error) {
    console.error(`[ERROR] Gemini translation failed: ${error.message}`);
    console.log(`[INFO] Falling back to Sarvam Translate API`);
    
    try {
      const fallbackResult = await translateWithSarvam(text, targetLang);
      console.log(`[INFO] Sarvam fallback translation successful for ${targetLang}`);
      return fallbackResult;
    } catch (fallbackError) {
      console.error(`[ERROR] Both Gemini and Sarvam translation failed`);
      throw new Error(`Translation failed - Gemini: ${error.message}, Sarvam: ${fallbackError.message}`);
    }
  }
};