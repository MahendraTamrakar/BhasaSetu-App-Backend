import express from 'express';
import translationRoutes from './translationRoutes.js';
import fileRoutes from './fileRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Main routes
router.use('/', translationRoutes);
router.use('/', fileRoutes);
router.use('/', healthRoutes);

export default router;