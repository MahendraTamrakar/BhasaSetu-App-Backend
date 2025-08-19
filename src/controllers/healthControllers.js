export const getApiInfo = (req, res) => {
  res.json({
    message: "BhashaSettu Translation API",
    version: "2.0",
    powered_by: "Google Gemini AI & Edge TTS"
  });
};

export const healthCheck = (req, res) => {
  res.json({
    status: "healthy",
    message: "BhashaSettu translation service is running"
  });
};