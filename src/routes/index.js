import express from 'express';
import translationRoutes from './translationRoutes.js';
import fileRoutes from './fileRoutes.js';
import healthRoutes from './healthRoutes.js';
import summaryRoutes from './summaryRoutes.js';

const router = express.Router();

// Main routes
router.use('/', translationRoutes);
router.use('/', fileRoutes);
router.use('/', healthRoutes);
router.use('/', summaryRoutes);

export default router;