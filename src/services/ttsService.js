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

/**
 * Generate audio using Google TTS
 * @param {string} text - Text to convert to speech
 * @param {string} lang - Language for TTS
 * @returns {Promise<string>} - Generated audio filename
 */
export const generateAudio = async (text, lang) => {
  try {
    console.log(`[DEBUG] Generating audio for language: ${lang}`);
    
    const gttslang = GTTS_LANGUAGE_MAP[lang];
    if (!gttslang) {
      throw new Error(`TTS language not found for: '${lang}'. Available: ${Object.keys(GTTS_LANGUAGE_MAP).join(', ')}`);
    }

    // Limit text length for TTS
    let processedText = text;
    if (text.length > TTS_TEXT_LIMIT) {
      processedText = text.substring(0, TTS_TEXT_LIMIT) + "...";
      console.log(`[DEBUG] Text truncated to ${TTS_TEXT_LIMIT} characters for TTS`);
    }

    // Generate unique filename
    const filename = `audio_${uuidv4()}.mp3`;
    const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
    const filePath = path.join(uploadFolder, filename);

    console.log(`[DEBUG] Generating TTS with language: ${gttslang}`);
    
    return new Promise((resolve, reject) => {
      const tts = gtts(gttslang);
      
      tts.save(filePath, processedText, (err) => {
        if (err) {
          console.error(`[ERROR] TTS generation failed: ${err.message}`);
          reject(new Error(`TTS generation failed: ${err.message}`));
        } else {
          console.log(`[DEBUG] Audio file saved successfully: ${filePath}`);
          resolve(filename);
        }
      });
    });
    
  } catch (error) {
    console.error(`[ERROR] Failed to generate audio: ${error.message}`);
    throw new Error(`Audio generation failed: ${error.message}`);
  }
};