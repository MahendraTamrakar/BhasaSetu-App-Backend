import { translateWithGemini } from '../services/geminiService.js';
import { generateAudio } from '../services/ttsService.js';
import { extractTextFromFile, cleanupFile } from '../utils/fileUtils.js';
import { LANGUAGE_VOICE_MAP } from '../config/languages.js';

export const translateText = async (req, res) => {
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

    console.log(`[INFO] Translating text to ${cleanTargetLang}`);

    // Translate using Gemini AI
    const translatedText = await translateWithGemini(cleanText, cleanTargetLang);

    // Generate audio using TTS
    let audioFilename = null;
    try {
      audioFilename = await generateAudio(translatedText, cleanTargetLang);
      console.log(`[INFO] Audio generated: ${audioFilename}`);
    } catch (audioError) {
      console.log(`[WARNING] Audio generation failed: ${audioError.message}`);
      // Continue without audio
    }

    // Response format matching Flutter app expectations
    const responseData = {
      original_text: cleanText,
      translated_text: translatedText,
      target_language: cleanTargetLang,
      detected_language: 'auto' // Gemini handles auto-detection
    };
    
    if (audioFilename) {
      responseData.audio_filename = audioFilename;
    }

    console.log(`[INFO] Text translation completed successfully`);
    res.json(responseData);

  } catch (error) {
    console.error(`[ERROR] Error in translateText: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const translateFile = async (req, res) => {
  let filePath = null;

  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided'
      });
    }

    const { target_lang } = req.body;

    if (!target_lang) {
      return res.status(400).json({
        error: 'Missing target_lang parameter'
      });
    }

    const cleanTargetLang = target_lang.trim();

    // Check if target language is supported
    if (!(cleanTargetLang in LANGUAGE_VOICE_MAP)) {
      return res.status(400).json({
        error: `Unsupported target language: ${cleanTargetLang}. Supported: ${Object.keys(LANGUAGE_VOICE_MAP).join(', ')}`
      });
    }

    filePath = req.file.path;
    const originalFilename = req.file.originalname;

    console.log(`[INFO] Extracting text from file: ${originalFilename}`);
    
    // Extract text from file
    const extractedText = await extractTextFromFile(filePath, originalFilename);

    if (!extractedText) {
      return res.status(400).json({
        error: 'No text found in the file'
      });
    }

    console.log(`[INFO] Translating file content to ${cleanTargetLang}`);
    
    // Translate using Gemini AI
    const translatedText = await translateWithGemini(extractedText, cleanTargetLang);

    // Generate audio using TTS
    let audioFilename = null;
    try {
      audioFilename = await generateAudio(translatedText, cleanTargetLang);
      console.log(`[INFO] Audio generated: ${audioFilename}`);
    } catch (audioError) {
      console.log(`[WARNING] Audio generation failed: ${audioError.message}`);
      // Continue without audio
    }

    // Response format matching Flutter app expectations
    const fileExtension = originalFilename.split('.').pop().toLowerCase();
    const responseData = {
      original_text: extractedText,
      translated_text: translatedText,
      target_language: cleanTargetLang,
      detected_language: 'auto',
      file_type: fileExtension
    };
    
    if (audioFilename) {
      responseData.audio_filename = audioFilename;
    }

    console.log(`[INFO] File translation completed successfully`);
    res.json(responseData);

  } catch (error) {
    console.error(`[ERROR] Error in translateFile: ${error.message}`);
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up uploaded file
    if (filePath) {
      await cleanupFile(filePath);
    }
  }
};

export const getSupportedLanguages = (req, res) => {
  res.json({
    languages: Object.keys(LANGUAGE_VOICE_MAP),
    total_languages: Object.keys(LANGUAGE_VOICE_MAP).length
  });
};