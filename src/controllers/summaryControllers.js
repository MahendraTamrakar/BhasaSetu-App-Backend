import { model } from '../config/gemini.js';
import { generateAudio } from '../services/ttsService.js';
import { cleanOutput } from '../utils/textUtils.js';
import { LANGUAGE_VOICE_MAP } from '../config/languages.js';

/**
 * Generate AI summary of translated text
 */
export const summarizeText = async (req, res) => {
  try {
    const { text, target_lang } = req.body;

    // Validation
    if (!text || !target_lang) {
      return res.status(400).json({
        error: 'Missing text or target_lang parameter'
      });
    }

    const cleanText = text.trim();
    const cleanTargetLang = target_lang.trim();

    if (!cleanText) {
      return res.status(400).json({
        error: 'Empty text provided'
      });
    }

    // Check if target language is supported
    if (!(cleanTargetLang in LANGUAGE_VOICE_MAP)) {
      return res.status(400).json({
        error: `Unsupported target language: ${cleanTargetLang}. Supported: ${Object.keys(LANGUAGE_VOICE_MAP).join(', ')}`
      });
    }

    console.log(`[INFO] Generating summary in ${cleanTargetLang}`);

    // Generate summary using Gemini AI
    const prompt = `Create a concise summary of the following text in ${cleanTargetLang}. 
    The summary should capture the main points and key information in a clear, readable format.
    Provide only the summary without any additional commentary.
    
    Text to summarize:
    ${cleanText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = cleanOutput(response.text());

    // Generate audio using TTS
    let audioFilename = null;
    try {
      audioFilename = await generateAudio(summaryText, cleanTargetLang);
      console.log(`[INFO] Summary audio generated: ${audioFilename}`);
    } catch (audioError) {
      console.log(`[WARNING] Summary audio generation failed: ${audioError.message}`);
      // Continue without audio
    }

    // Response format
    const responseData = {
      summary: summaryText,
      target_language: cleanTargetLang,
      original_text_length: cleanText.length,
      summary_length: summaryText.length
    };
    
    if (audioFilename) {
      responseData.audio_filename = audioFilename;
    }

    console.log(`[INFO] Summary generated successfully`);
    res.json(responseData);

  } catch (error) {
    console.error(`[ERROR] Error in summarizeText: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Extract key points from translated text
 */
export const extractKeyPoints = async (req, res) => {
  try {
    const { text, target_lang } = req.body;

    // Validation
    if (!text || !target_lang) {
      return res.status(400).json({
        error: 'Missing text or target_lang parameter'
      });
    }

    const cleanText = text.trim();
    const cleanTargetLang = target_lang.trim();

    if (!cleanText) {
      return res.status(400).json({
        error: 'Empty text provided'
      });
    }

    // Check if target language is supported
    if (!(cleanTargetLang in LANGUAGE_VOICE_MAP)) {
      return res.status(400).json({
        error: `Unsupported target language: ${cleanTargetLang}. Supported: ${Object.keys(LANGUAGE_VOICE_MAP).join(', ')}`
      });
    }

    console.log(`[INFO] Extracting key points in ${cleanTargetLang}`);

    // Extract key points using Gemini AI
    const prompt = `Extract the key points from the following text in ${cleanTargetLang}. 
    Present them as a numbered list of the most important points.
    Each point should be concise but informative.
    Provide only the key points without any additional commentary.
    
    Text to analyze:
    ${cleanText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const keyPointsText = cleanOutput(response.text());

    // Generate audio using TTS
    let audioFilename = null;
    try {
      audioFilename = await generateAudio(keyPointsText, cleanTargetLang);
      console.log(`[INFO] Key points audio generated: ${audioFilename}`);
    } catch (audioError) {
      console.log(`[WARNING] Key points audio generation failed: ${audioError.message}`);
      // Continue without audio
    }

    // Response format
    const responseData = {
      key_points: keyPointsText,
      target_language: cleanTargetLang,
      original_text_length: cleanText.length,
      key_points_length: keyPointsText.length
    };
    
    if (audioFilename) {
      responseData.audio_filename = audioFilename;
    }

    console.log(`[INFO] Key points extracted successfully`);
    res.json(responseData);

  } catch (error) {
    console.error(`[ERROR] Error in extractKeyPoints: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};