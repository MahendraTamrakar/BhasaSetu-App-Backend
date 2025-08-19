export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /supported-languages',
      'POST /translate-text',
      'POST /translate',
      'GET /uploads/:filename'
    ]
  });
};