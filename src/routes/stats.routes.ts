import { Router } from 'express';
import { computeStatsHandler } from '../controllers/stats.controller';
import { authenticateM2M } from '../middlewares/auth.middleware';

const router = Router();

// Protegida con JWT
router.post('/', authenticateM2M, computeStatsHandler);

export default router;