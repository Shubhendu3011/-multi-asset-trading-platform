import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Users routes - Coming in Phase 2' });
});

export default router; 