import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserController } from '../controllers/user.controller.js';
import { validateProfileUpdate, validateRoleUpdate, validateUserUpdate } from '../validators/user.validator.js';

const router = Router();

router.get('/me', authenticate, authorize('USER', 'ADMIN', 'SUPER_ADMIN'), UserController.getProfile);
router.patch('/me', authenticate, authorize('USER', 'ADMIN', 'SUPER_ADMIN'), validateProfileUpdate, UserController.updateProfile);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.list);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.get);
router.patch('/:id/role', authenticate, authorize('SUPER_ADMIN'), validateRoleUpdate, UserController.updateRole);
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateUserUpdate, UserController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.delete);

export default router;
