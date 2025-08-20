# BhashaSettu Translation Backend (Node.js)

A powerful translation API backend built with Node.js/Express, Google Gemini AI, and Edge TTS for multilingual text and document translation with audio generation.

## 🚀 Features

- **Text Translation**: Translate text between multiple Indian and international languages
- **Document Translation**: Support for PDF, images (PNG, JPG, JPEG, GIF), and text files
- **Audio Generation**: Text-to-speech in multiple Indian languages using Edge TTS
- **OCR Support**: Extract text from images using Tesseract.js
- **PDF Processing**: Extract text from PDF documents
- **RESTful API**: Clean, well-documented API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **File Upload**: Secure file upload with size and type restrictions
- **Health Monitoring**: Health check endpoints for service monitoring

## 🌍 Supported Languages

- Hindi, Tamil, Marathi, Gujarati, Punjabi
- Bengali, Telugu, Kannada, Malayalam, English

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Google Gemini API key

## 🛠️ Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd bhashasettu-backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
NODE_ENV=development
PORT=8080
GEMINI_API_KEY=your_gemini_api_key_here
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=16777216
```

4. **Install system dependencies for TTS**:

For Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install espeak espeak-data libespeak-dev ffmpeg
```

For macOS:
```bash
brew install espeak ffmpeg
```

For Windows:
```bash
# Install espeak from http://espeak.sourceforge.net/download.html
# Install ffmpeg from https://ffmpeg.org/download.html
```

5. **Start the server**:

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (Gemini, languages)
│   ├── controllers/     # Route controllers
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (Gemini, TTS)
│   ├── middlewares/     # Custom middleware
│   ├── utils/           # Utility functions
│   └── app.js           # Express app configuration
├── tests/               # Unit tests
├── uploads/             # File uploads and generated audio
├── .env                 # Environment variables
├── server.js            # Server entry point
└── package.json
```

## 🔌 API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check
- `GET /supported-languages` - List supported languages

### Translation
- `POST /translate-text` - Translate plain text
- `POST /translate` - Translate file content
- `GET /uploads/:filename` - Serve audio/upload files

### AI Features
- `POST /summarize` - Generate AI summary of text
- `POST /key-points` - Extract key points from text

### Request Examples

**Text Translation:**
```bash
curl -X POST http://localhost:5000/translate-text \
  -F "text=Hello world" \
  -F "target_lang=Hindi"
```

**File Translation:**
```bash
curl -X POST http://localhost:5000/translate \
  -F "file=@document.pdf" \
  -F "target_lang=Tamil"
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode for development:
```bash
npm run test:watch
```

## 📝 Response Format

**Text Translation Response:**
```json
{
  "original_text": "Hello world",
  "translated_text": "नमस्ते दुनिया",
  "target_language": "Hindi",
  "detected_language": "auto",
  "audio_filename": "audio_123456789.mp3"
}
```

**File Translation Response:**
```json
{
  "original_text": "Document content...",
  "translated_text": "अनुवादित सामग्री...",
  "target_language": "Hindi",
  "detected_language": "auto",
  "file_type": "pdf",
  "audio_filename": "audio_123456789.mp3"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `8080` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `UPLOAD_FOLDER` | Upload directory | `uploads` |
| `MAX_FILE_SIZE` | Max file size in bytes | `16777216` (16MB) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### File Support

- **Text Files**: `.txt`
- **PDF Files**: `.pdf`
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`
- **Max Size**: 16MB per file

## 🚦 Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `413` - File Too Large
- `429` - Too Many Requests
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Prevent API abuse
- **File Validation**: Secure file upload restrictions
- **Input Sanitization**: Clean and validate all inputs

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Health Endpoints**: Service monitoring
- **Error Logging**: Comprehensive error tracking
- **Development Logging**: Detailed debug information

## 🚀 Deployment

### Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure reverse proxy (nginx)
3. Set up SSL/TLS certificates
4. Configure environment variables
5. Set up monitoring and logging

## 🤝 Flutter Integration

This backend is designed to work seamlessly with the provided Flutter `api_service.dart`. No changes needed to the Flutter frontend - just update the `baseUrl` in `api_service.dart` to point to your deployed backend.

## 📋 Todo / Future Enhancements

- [ ] Add DOCX support using mammoth.js
- [ ] Implement caching for frequently translated content
- [ ] Add translation history/audit logging
- [ ] Implement batch translation endpoints
- [ ] Add support for more TTS voices
- [ ] Language auto-detection improvements
- [ ] Add translation quality scoring
- [ ] Implement user authentication/API keys

## 🐛 Troubleshooting

**Common Issues:**

1. **Gemini API Key Error**: Ensure `GEMINI_API_KEY` is set correctly
2. **File Upload Issues**: Check file size and type restrictions
3. **TTS Generation Fails**: Verify internet connection and Edge TTS availability
4. **OCR Issues**: Ensure image quality is sufficient for text recognition

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for translation services
- Microsoft Edge TTS for multilingual audio generation
- Tesseract.js for OCR capabilities
- pdf-parse for PDF text extraction
