import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '../config/languages.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
  if (ALLOWED_EXTENSIONS.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported. Supported: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
  }
};

// Export multer configuration
export const uploadConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Only allow 1 file at a time
  }
};