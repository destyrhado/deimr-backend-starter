import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserController } from '../controllers/user.controller.js';
import { validateUserUpdate } from '../validators/user.validator.js';

const router = Router();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get paginated list of users
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
 *     summary: Get a single user by ID
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
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update a user by ID
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateUserUpdate, UserController.update);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
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
