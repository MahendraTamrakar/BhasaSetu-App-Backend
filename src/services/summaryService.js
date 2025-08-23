import { model } from '../config/gemini.js';
import { cleanOutput } from '../utils/textUtils.js';

/**
 * Generate AI summary using Google Gemini AI
 * @param {string} text - Text to summarize
 * @param {string} targetLang - Target language for summary
 * @returns {Promise<string>} - Generated summary
 */
export const generateSummary = async (text, targetLang) => {
  try {
    console.log(`[INFO] Generating summary with Gemini AI in ${targetLang}`);
    
    const prompt = `Please provide a concise summary of the following text in ${targetLang}. 
    Keep the summary informative but brief, highlighting the main points and key information.
    Provide only the summary without any additional commentary.
    
    Text to summarize:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = response.text();

    console.log(`[INFO] Gemini summary generation successful in ${targetLang}`);
    return cleanOutput(summaryText);
  } catch (error) {
    console.error(`[ERROR] Gemini summary generation failed: ${error.message}`);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
};

/**
 * Generate key points from text using Google Gemini AI
 * @param {string} text - Text to extract key points from
 * @param {string} targetLang - Target language for key points
 * @returns {Promise<string>} - Generated key points
 */
export const generateKeyPoints = async (text, targetLang) => {
  try {
    console.log(`[INFO] Extracting key points with Gemini AI in ${targetLang}`);
    
    const prompt = `Please extract and list the key points from the following text in ${targetLang}. 
    Format the response as a bulleted list of the most important points.
    Provide only the key points without additional commentary.
    
    Text to analyze:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const keyPointsText = response.text();

    console.log(`[INFO] Gemini key points extraction successful in ${targetLang}`);
    return cleanOutput(keyPointsText);
  } catch (error) {
    console.error(`[ERROR] Gemini key points generation failed: ${error.message}`);
    throw new Error(`Key points generation failed: ${error.message}`);
  }
};