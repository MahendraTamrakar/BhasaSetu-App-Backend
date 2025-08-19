import edgeTts from 'node-edge-tts';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { LANGUAGE_VOICE_MAP, TTS_TEXT_LIMIT } from '../config/languages.js';

/**
 * Generate audio using Edge TTS
 * @param {string} text - Text to convert to speech
 * @param {string} lang - Language for TTS
 * @returns {Promise<string>} - Generated audio filename
 */
export const generateAudio = async (text, lang) => {
  try {
    console.log(`[DEBUG] Generating audio for language: ${lang}`);
    
    const voice = LANGUAGE_VOICE_MAP[lang];
    if (!voice) {
      throw new Error(`Edge TTS voice not found for language: '${lang}'. Available: ${Object.keys(LANGUAGE_VOICE_MAP).join(', ')}`);
    }

    // Limit text length for TTS (edge-tts has limits)
    let processedText = text;
    if (text.length > TTS_TEXT_LIMIT) {
      processedText = text.substring(0, TTS_TEXT_LIMIT) + "...";
      console.log(`[DEBUG] Text truncated to ${TTS_TEXT_LIMIT} characters for TTS`);
    }

    // Generate unique filename
    const filename = `audio_${uuidv4()}.mp3`;
    const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
    const filePath = path.join(uploadFolder, filename);

    // Generate audio using Edge TTS
    const ttsOptions = {
      voice: voice,
      lang: lang,
      slow: false,
      host: 'https://speech.platform.bing.com'
    };

    console.log(`[DEBUG] Generating TTS with voice: ${voice}`);
    
    const audioBuffer = await edgeTts.tts(processedText, ttsOptions);
    
    // Save audio file
    await fs.writeFile(filePath, audioBuffer);
    
    console.log(`[DEBUG] Audio file saved successfully: ${filePath}`);
    return filename;
    
  } catch (error) {
    console.error(`[ERROR] Failed to generate audio: ${error.message}`);
    throw new Error(`Audio generation failed: ${error.message}`);
  }
};