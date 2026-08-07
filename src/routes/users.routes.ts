import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserController } from '../controllers/user.controller.js';
import { validateRoleUpdate, validateUserUpdate } from '../validators/user.validator.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User profile and admin user management
 */

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your profile data
 */
router.get('/me', authenticate, authorize('USER', 'ADMIN', 'SUPER_ADMIN'), UserController.getProfile);

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/me', authenticate, authorize('USER', 'ADMIN', 'SUPER_ADMIN'), validateUserUpdate, UserController.updateProfile);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get paginated list of users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.list);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 */
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.get);

/**
 * @openapi
 * /api/v1/users/{id}/role:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a user's role
 *     description: Only SUPER_ADMIN may change roles.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, SUPER_ADMIN]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/:id/role', authenticate, authorize('SUPER_ADMIN'), validateRoleUpdate, UserController.updateRole);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateUserUpdate, UserController.update);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.delete);

export default router;
