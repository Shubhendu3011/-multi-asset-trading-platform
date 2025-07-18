import { Router } from 'express';

const router = Router();

// TODO: Implement in Phase 2 - Authentication & User Management
router.get('/health', (req, res) => {
  res.json({ message: 'Auth routes - Coming in Phase 2' });
});

export default router; 