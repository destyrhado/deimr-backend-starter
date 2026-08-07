import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), (_req, res) => {
  res.json({ success: true, message: 'Users list placeholder', data: [] });
});

export default router;
