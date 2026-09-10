import { Router } from 'express';
import healthRoutes from './health.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/stats', statsRoutes);

export default router;