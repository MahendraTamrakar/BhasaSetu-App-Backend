// Sarvam API configuration and constants
export const SARVAM_CONFIG = {
  BASE_URL: 'https://api.sarvam.ai',
  ENDPOINTS: {
    TRANSLATE: '/translate',
    TTS: '/text-to-speech'
  },
  MODELS: {
    TRANSLATE: 'sarvam-translate:v1',
    TTS: 'bulbul:v2'
  },
  DEFAULT_TTS_OPTIONS: {
    speaker: 'meera',
    pitch: 0,
    pace: 1.0,
    loudness: 1.0,
    speech_sample_rate: 22050,
    enable_preprocessing: true
  }
};

// Sarvam language code mapping for translation and TTS
export const SARVAM_LANGUAGE_CODES = {
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

// Validate Sarvam API key
export const validateSarvamConfig = () => {
  if (!process.env.SARVAM_API_KEY) {
    console.warn('[WARNING] SARVAM_API_KEY not set - fallback services will not work');
    return false;
  }
  console.log('[INFO] Sarvam API configuration validated');
  return true;
};

// Get Sarvam language code
export const getSarvamLanguageCode = (languageName) => {
  return SARVAM_LANGUAGE_CODES[languageName] || null;
};

// Check if language is supported by Sarvam
export const isSarvamLanguageSupported = (languageName) => {
  return languageName in SARVAM_LANGUAGE_CODES;
};