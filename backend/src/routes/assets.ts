import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Assets routes - Coming in Phase 3' });
});

export default router;
