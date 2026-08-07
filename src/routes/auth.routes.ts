import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateLogin, validateRefresh, validateRegister } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/refresh', validateRefresh, AuthController.refresh);
router.post('/logout', validateRefresh, AuthController.logout);

export default router;
