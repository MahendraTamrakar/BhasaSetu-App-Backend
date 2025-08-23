import gtts from 'node-gtts';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { LANGUAGE_VOICE_MAP, TTS_TEXT_LIMIT } from '../config/languages.js';

// Language mapping for Google TTS
const GTTS_LANGUAGE_MAP = {
  "Hindi": "hi",
  "Tamil": "ta", 
  "Marathi": "mr",
  "Gujarati": "gu",
  "Punjabi": "pa",
  "Bengali": "bn",
  "Telugu": "te",
  "Kannada": "kn",
  "Malayalam": "ml",
  "English": "en",
};

// Sarvam language code mapping for TTS
const SARVAM_TTS_LANGUAGE_MAP = {
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

// Valid speakers for bulbul:v2 model (from API error message)
// Available speakers: anushka, abhilash, manisha, vidya, arya, karun, hitesh
const SARVAM_SPEAKERS = {
  "hi-IN": "anushka",    // Hindi - Female voice
  "ta-IN": "vidya",      // Tamil - Female voice
  "mr-IN": "manisha",    // Marathi - Female voice
  "gu-IN": "anushka",    // Gujarati - Female voice
  "pa-IN": "arya",       // Punjabi - Female voice
  "bn-IN": "vidya",      // Bengali - Female voice
  "te-IN": "anushka",    // Telugu - Female voice
  "kn-IN": "vidya",      // Kannada - Female voice
  "ml-IN": "anushka",    // Malayalam - Female voice
  "en-IN": "anushka",    // English - Female voice (default)
};

/**
 * Generate audio using Sarvam TTS API as fallback
 * @param {string} text - Text to convert to speech
 * @param {string} lang - Language for TTS
 * @returns {Promise<string>} - Generated audio filename
 */
const generateAudioWithSarvam = async (text, lang) => {
  try {
    if (!process.env.SARVAM_API_KEY) {
      throw new Error('SARVAM_API_KEY not set in environment variables');
    }

    const sarvamLangCode = SARVAM_TTS_LANGUAGE_MAP[lang];
    if (!sarvamLangCode) {
      throw new Error(`Sarvam TTS does not support language: ${lang}`);
    }

    console.log(`[INFO] Using Sarvam TTS API for ${lang} with code: ${sarvamLangCode}`);

    // Limit text length for TTS
    let processedText = text;
    if (text.length > TTS_TEXT_LIMIT) {
      processedText = text.substring(0, TTS_TEXT_LIMIT) + "...";
      console.log(`[DEBUG] Text truncated to ${TTS_TEXT_LIMIT} characters for Sarvam TTS`);
    }

    // Get appropriate speaker for the language
    const speaker = SARVAM_SPEAKERS[sarvamLangCode] || "anushka";

    console.log(`[DEBUG] Sarvam TTS request - Language: ${sarvamLangCode}, Speaker: ${speaker}, Text length: ${processedText.length}`);

    const requestBody = {
      inputs: [processedText],
      target_language_code: sarvamLangCode,
      speaker: speaker,
      pitch: 0,
      pace: 1.0,
      loudness: 1.0,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: "bulbul:v2"
    };

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Subscription-Key': process.env.SARVAM_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`[DEBUG] Sarvam TTS response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Sarvam TTS API error response:`, errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
        const errorMessage = errorData.error?.message || errorData.message || response.statusText;
        throw new Error(`Sarvam TTS API error (${response.status}): ${errorMessage}`);
      } catch (parseError) {
        throw new Error(`Sarvam TTS API error (${response.status}): ${errorText}`);
      }
    }

    const data = await response.json();
    console.log(`[DEBUG] Sarvam TTS response received successfully`);
    
    if (!data.audios || !data.audios[0]) {
      console.error(`[ERROR] Sarvam TTS response structure:`, JSON.stringify(data, null, 2));
      throw new Error('No audio data returned from Sarvam TTS API');
    }

    // The API returns base64 encoded audio
    const audioBase64 = data.audios[0];
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Generate unique filename and save
    const filename = `audio_${uuidv4()}.wav`;
    const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
    const filePath = path.join(uploadFolder, filename);

    await fs.writeFile(filePath, audioBuffer);
    console.log(`[DEBUG] Sarvam audio file saved successfully: ${filePath}`);
    
    return filename;
  } catch (error) {
    console.error(`[ERROR] Sarvam TTS failed: ${error.message}`);
    throw new Error(`Sarvam TTS failed: ${error.message}`);
  }
};

/**
 * Generate audio using Google TTS (with better error handling)
 * @param {string} text - Text to convert to speech
 * @param {string} lang - Language for TTS
 * @returns {Promise<string>} - Generated audio filename
 */
const generateAudioWithGoogleTTS = async (text, lang) => {
  return new Promise((resolve, reject) => {
    try {
      const gttslang = GTTS_LANGUAGE_MAP[lang];
      if (!gttslang) {
        throw new Error(`Google TTS language not found for: '${lang}'. Available: ${Object.keys(GTTS_LANGUAGE_MAP).join(', ')}`);
      }

      // Limit text length for TTS
      let processedText = text;
      if (text.length > TTS_TEXT_LIMIT) {
        processedText = text.substring(0, TTS_TEXT_LIMIT) + "...";
        console.log(`[DEBUG] Text truncated to ${TTS_TEXT_LIMIT} characters for Google TTS`);
      }

      // Generate unique filename
      const filename = `audio_${uuidv4()}.mp3`;
      const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
      const filePath = path.join(uploadFolder, filename);

      console.log(`[DEBUG] Generating Google TTS with language: ${gttslang}`);
      
      const tts = gtts(gttslang);
      
      tts.save(filePath, processedText, (err) => {
        if (err) {
          console.error(`[ERROR] Google TTS error details:`, err);
          reject(new Error(`Google TTS generation failed: ${err.message || err}`));
        } else {
          console.log(`[DEBUG] Google TTS audio file saved successfully: ${filePath}`);
          resolve(filename);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate audio using Google TTS with Sarvam fallback
 * @param {string} text - Text to convert to speech
 * @param {string} lang - Language for TTS
 * @returns {Promise<string>} - Generated audio filename
 */
export const generateAudio = async (text, lang) => {
  try {
    console.log(`[DEBUG] Attempting audio generation with Google TTS for language: ${lang}`);
    
    // Try Google TTS first
    const result = await generateAudioWithGoogleTTS(text, lang);
    console.log(`[INFO] Google TTS generation successful for ${lang}`);
    return result;
    
  } catch (error) {
    console.error(`[ERROR] Google TTS failed: ${error.message}`);
    console.log(`[INFO] Falling back to Sarvam TTS API`);
    
    try {
      const fallbackResult = await generateAudioWithSarvam(text, lang);
      console.log(`[INFO] Sarvam TTS fallback successful for ${lang}`);
      return fallbackResult;
    } catch (fallbackError) {
      console.error(`[ERROR] Both Google TTS and Sarvam TTS failed`);
      
      // Enhanced error message
      const errorMessage = `Audio generation failed for ${lang}:\n` +
        `- Google TTS: ${error.message}\n` +
        `- Sarvam TTS: ${fallbackError.message}`;
      
      throw new Error(errorMessage);
    }
  }
};