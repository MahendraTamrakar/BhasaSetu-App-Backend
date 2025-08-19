// Language-to-voice map (Edge TTS) - matches Flutter app language names
export const LANGUAGE_VOICE_MAP = {
  "Hindi": "hi-IN-SwaraNeural",
  "Tamil": "ta-IN-PallaviNeural", 
  "Marathi": "mr-IN-AarohiNeural",
  "Gujarati": "gu-IN-DhwaniNeural",
  "Punjabi": "pa-IN-GaganNeural",
  "Bengali": "bn-IN-TanishaaNeural",
  "Telugu": "te-IN-ShrutiNeural",
  "Kannada": "kn-IN-SapnaNeural",
  "Malayalam": "ml-IN-SobhanaNeural",
  "English": "en-IN-NeerjaNeural",
};

// Allowed file extensions
export const ALLOWED_EXTENSIONS = ['txt', 'pdf', 'docx', 'png', 'jpg', 'jpeg', 'gif'];

// File size limits
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 16 * 1024 * 1024; // 16MB

// TTS text length limit
export const TTS_TEXT_LIMIT = 5000;