import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'File too large. Maximum size is 16MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Only 1 file allowed.' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field.' 
      });
    }
    return res.status(400).json({ 
      error: `File upload error: ${err.message}` 
    });
  }

  // Handle file type errors
  if (err.message && err.message.includes('File type not supported')) {
    return res.status(400).json({ error: err.message });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: err.message 
    });
  }

  // Handle rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  }

  // Handle other known errors
  if (err.status && err.message) {
    return res.status(err.status).json({ 
      error: err.message 
    });
  }

  // Generic server error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error' 
  });
};