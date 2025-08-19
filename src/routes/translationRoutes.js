import express from 'express';
import multer from 'multer';
import { 
  translateText, 
  translateFile, 
  getSupportedLanguages 
} from '../controllers/translationControllers.js';
import { uploadConfig } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer(uploadConfig);

// Translation routes
router.post('/translate-text', translateText);
router.post('/translate', upload.single('file'), translateFile);
router.get('/supported-languages', getSupportedLanguages);

export default router;