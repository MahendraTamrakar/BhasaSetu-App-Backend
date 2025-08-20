import express from 'express';
import { 
  summarizeText, 
  extractKeyPoints 
} from '../controllers/summaryControllers.js';


const router = express.Router();

// Summary routes
router.post('/summarize', summarizeText);
router.post('/key-points', extractKeyPoints);

export default router;