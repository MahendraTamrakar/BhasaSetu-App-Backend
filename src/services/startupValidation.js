import { validateSarvamConfig } from '../config/sarvam.js';
import { createDirectories } from '../utils/fileUtils.js';

/**
 * Validate all required configurations and dependencies at startup
 */
export const validateStartupConfig = async () => {
  console.log('[INFO] Starting configuration validation...');
  
  const validationResults = {
    gemini: false,
    sarvam: false,
    directories: false,
    environment: false
  };

  // Validate Gemini API key
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('[ERROR] GEMINI_API_KEY not set in environment variables');
    } else {
      validationResults.gemini = true;
      console.log('[INFO] Gemini API configuration validated');
    }
  } catch (error) {
    console.error(`[ERROR] Gemini validation failed: ${error.message}`);
  }

  // Validate Sarvam API configuration (optional for fallback)
  try {
    validationResults.sarvam = validateSarvamConfig();
  } catch (error) {
    console.warn(`[WARNING] Sarvam validation failed: ${error.message}`);
  }

  // Validate and create directories
  try {
    await createDirectories();
    validationResults.directories = true;
    console.log('[INFO] Directory structure validated');
  } catch (error) {
    console.error(`[ERROR] Directory validation failed: ${error.message}`);
  }

  // Validate environment variables
  try {
    const requiredEnvVars = ['GEMINI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`[ERROR] Missing required environment variables: ${missingVars.join(', ')}`);
    } else {
      validationResults.environment = true;
      console.log('[INFO] Environment variables validated');
    }
  } catch (error) {
    console.error(`[ERROR] Environment validation failed: ${error.message}`);
  }

  // Log validation summary
  console.log('\n=== Configuration Validation Summary ===');
  console.log(`Gemini API: ${validationResults.gemini ? '✅ Ready' : '❌ Failed'}`);
  console.log(`Sarvam API (fallback): ${validationResults.sarvam ? '✅ Ready' : '⚠️  Not configured'}`);
  console.log(`Directories: ${validationResults.directories ? '✅ Ready' : '❌ Failed'}`);
  console.log(`Environment: ${validationResults.environment ? '✅ Ready' : '❌ Failed'}`);

  // Determine if service can start
  const canStart = validationResults.gemini && validationResults.directories && validationResults.environment;
  
  if (canStart) {
    console.log('✅ Service ready to start');
    if (!validationResults.sarvam) {
      console.log('⚠️  Warning: Fallback services will not be available without Sarvam API key');
    }
  } else {
    console.log('❌ Service cannot start due to configuration issues');
    process.exit(1);
  }

  console.log('=========================================\n');
  
  return validationResults;
};