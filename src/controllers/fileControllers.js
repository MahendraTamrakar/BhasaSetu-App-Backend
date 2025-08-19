import path from 'path';
import fs from 'fs/promises';

export const serveFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';
    const filePath = path.join(uploadFolder, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    // Serve the file
    res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    console.error(`[ERROR] Error serving file: ${error.message}`);
    res.status(404).json({ error: 'File not found' });
  }
};