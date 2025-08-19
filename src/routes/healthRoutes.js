import express from 'express';
import { getApiInfo, healthCheck } from '../controllers/healthControllers.js';

const router = express.Router();

// Health and info routes
router.get('/', getApiInfo);
router.get('/health', healthCheck);

export default router;