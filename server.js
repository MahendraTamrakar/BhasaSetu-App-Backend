import dotenv from 'dotenv';
import app from './src/app.js';
import { validateStartupConfig } from './src/services/startupValidation.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start the server with validation
 */
const startServer = async () => {
  try {
    console.log('🚀 BhashaSettu Translation API Starting...\n');
    
    // Validate configuration before starting
    await validateStartupConfig();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🌟 BhashaSettu API Server running on port ${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 API Info: http://localhost:${PORT}/\n`);
      
      // Log available endpoints
      console.log('📍 Available Endpoints:');
      console.log('   GET  /                    - API Information');
      console.log('   GET  /health             - Health Check');
      console.log('   GET  /supported-languages - Get Supported Languages');
      console.log('   POST /translate-text     - Translate Text');
      console.log('   POST /translate          - Translate File');
      console.log('   POST /summarize          - Generate Summary');
      console.log('   POST /key-points         - Extract Key Points');
      console.log('   GET  /uploads/:filename  - Serve Audio Files');
      console.log('\n✅ Server started successfully!');
    });
    
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();