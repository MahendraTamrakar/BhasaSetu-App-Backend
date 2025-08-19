import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import mammoth from 'mammoth';

/**
 * Create necessary directories
 */
export const createDirectories = async () => {
  const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
  
  try {
    await fs.mkdir(uploadFolder, { recursive: true });
    console.log(`[INFO] Upload directory created/verified: ${uploadFolder}`);
  } catch (error) {
    console.error(`[ERROR] Failed to create upload directory: ${error.message}`);
  }
};

/**
 * Extract text from PDF using pdf-parse
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPdf = async (pdfPath) => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text.trim();
  } catch (error) {
    throw new Error(`Error extracting text from PDF: ${error.message}`);
  }
};

/* /**
 * Extract text from image using OCR (Tesseract.js)
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string>} - Extracted text
  *//*
const extractTextFromImage = async (imagePath) => {
  try {
    console.log(`[INFO] Starting OCR for image: ${imagePath}`);
    
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    console.log(`[INFO] OCR completed successfully`);
    return text.trim();
  } catch (error) {
    throw new Error(`Error extracting text from image: ${error.message}`);
  }
}; */

/**
 * Preprocess image (grayscale, normalize, threshold) to improve OCR
 * @param {string} inputPath
 * @param {string} outputPath
 */
const preprocessImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .grayscale()
    .normalize()
    .threshold(150)
    .toFile(outputPath);
  return outputPath;
};

/**
 * Extract text from image using OCR (Tesseract.js + preprocessing)
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromImage = async (imagePath) => {
  try {
    console.log(`[INFO] Preprocessing image before OCR: ${imagePath}`);
    const preprocessedPath = imagePath + "_processed.png";
    await preprocessImage(imagePath, preprocessedPath);

    console.log(`[INFO] Starting OCR for image: ${preprocessedPath}`);
    const { data: { text } } = await Tesseract.recognize(
      preprocessedPath,
      "eng", // keep English for OCR
      {
        logger: m => {
          if (m.status === "recognizing text") {
            console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log(`[INFO] OCR completed successfully`);
    return text.trim();
  } catch (error) {
    throw new Error(`Error extracting text from image: ${error.message}`);
  }
};

/**
 * Extract text from plain text file
 * @param {string} filePath - Path to text file
 * @returns {Promise<string>} - File content
 */
const extractTextFromTxt = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.trim();
  } catch (error) {
    throw new Error(`Error reading text file: ${error.message}`);
  }
};

/**
 * Extract text from DOCX file using Mammoth.js
 * @param {string} filePath - Path to DOCX file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromDocx = async (filePath) => {
  try {
    const { value: text } = await mammoth.extractRawText({ path: filePath });
    return text.trim();
  } catch (error) {
    throw new Error(`Error extracting text from DOCX: ${error.message}`);
  }
};


/**
 * Extract text from file based on extension
 * @param {string} filePath - Path to file
 * @param {string} filename - Original filename
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromFile = async (filePath, filename) => {
  const fileExtension = filename.split('.').pop().toLowerCase();
  
  switch (fileExtension) {
    case 'pdf':
      return await extractTextFromPdf(filePath);
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return await extractTextFromImage(filePath);
    case 'txt':
      return await extractTextFromTxt(filePath);
    case 'docx':
      // For now, treat DOCX as unsupported or add mammoth.js for proper support
      return await extractTextFromDocx(filePath);
      //throw new Error('DOCX files are not yet supported. Please convert to PDF or TXT.');
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
};

/**
 * Clean up temporary files
 * @param {string} filePath - Path to file to delete
 */
export const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`[INFO] Cleaned up file: ${filePath}`);
  } catch (error) {
    console.warn(`[WARNING] Failed to cleanup file ${filePath}: ${error.message}`);
  }
};

/**
 * Check if file exists
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} - True if file exists
 */
export const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};