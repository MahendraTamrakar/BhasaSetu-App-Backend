import dotenv from 'dotenv';
import app from './src/app.js';
import { createDirectories } from './src/utils/fileUtils.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create necessary directories
createDirectories();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Starting BhashaSettu Translation Backend...');
  console.log('📍 Available endpoints:');
  console.log('   - POST /translate-text (for text translation)');
  console.log('   - POST /translate (for file translation)');
  console.log('   - GET /uploads/:filename (for file downloads)');
  console.log('   - GET /health (health check)');
  console.log('   - GET /supported-languages (get supported languages)');
  console.log('🎯 Supported languages: Hindi, Tamil, Marathi, Gujarati, Punjabi, Bengali, Telugu, Kannada, Malayalam, English');
  console.log('⚡ Powered by Google Gemini AI & Edge TTS');
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});