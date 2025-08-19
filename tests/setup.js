import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

// Set default test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random port for tests
process.env.UPLOAD_FOLDER = 'test_uploads';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test_api_key';

// Mock console methods to reduce noise during tests
const originalConsole = { ...console };

global.mockConsole = () => {
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
};

global.restoreConsole = () => {
  Object.assign(console, originalConsole);
};