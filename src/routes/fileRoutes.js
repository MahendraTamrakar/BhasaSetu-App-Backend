import express from 'express';
import { serveFile } from '../controllers/fileControllers.js';

const router = express.Router();

// File serving route
router.get('/uploads/:filename', serveFile);

export default router;