import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserController } from '../controllers/user.controller.js';
import { validateRoleUpdate, validateUserUpdate } from '../validators/user.validator.js';

const router = Router();

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve the authenticated user's profile.
 *     description: Returns profile details for the current authenticated user. Requires a valid JWT and any authenticated role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Authenticated user profile returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Token is valid but the role is not authorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authenticate, authorize('USER', 'ADMIN', 'SUPER_ADMIN'), UserController.getProfile);

/**
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update the authenticated user's profile.
 *     description: Modify user profile fields for the signed-in user. This endpoint supports changing the name, email, and password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           examples:
 *             profileUpdate:
 *               value:
 *                 name: "Jane Smith"
 *                 email: "jane.smith@example.com"
 *                 password: "StrongPassword123!"
 *     responses:
 *       '200':
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid profile update payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Token is valid but the role is not authorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/me', authenticate, authorize('USER', 'ADMIN', 'SUPER_ADMIN'), validateUserUpdate, UserController.updateProfile);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Retrieve a paginated list of user accounts.
 *     description: Returns a paginated list of users for administrators. Supports filtering by role and status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number to return.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Number of users per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *         description: Sort order of returned users.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN, SUPER_ADMIN]
 *         description: Filter results by role.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         description: Filter results by account status.
 *     responses:
 *       '200':
 *         description: Paginated user list returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *             examples:
 *               adminListExample:
 *                 value:
 *                   success: true
 *                   message: "Users loaded successfully."
 *                   data:
 *                     users:
 *                       - id: "64d0b4d4b6e8f9c3ad2f58c7"
 *                         name: "Jane Doe"
 *                         email: "jane@example.com"
 *                         role: "USER"
 *                         status: "ACTIVE"
 *                         createdAt: "2026-08-08T00:00:00.000Z"
 *                         updatedAt: "2026-08-08T00:00:00.000Z"
 *                     meta:
 *                       page: 1
 *                       limit: 20
 *                       total: 1
 *                       pages: 1
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User must have ADMIN or SUPER_ADMIN role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.list);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Retrieve a user account by identifier.
 *     description: Return a single user's profile by ID. Requires ADMIN or SUPER_ADMIN authorization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier.
 *     responses:
 *       '200':
 *         description: User account details returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User must have ADMIN or SUPER_ADMIN role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.get);

/**
 * @openapi
 * /api/v1/users/{id}/role:
 *   patch:
 *     tags:
 *       - Super Administration
 *     summary: Update a user's role.
 *     description: Change a user's role. This action is restricted to SUPER_ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier for role update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleUpdateRequest'
 *           examples:
 *             promoteUser:
 *               value:
 *                 role: "ADMIN"
 *             promoteSuperAdmin:
 *               value:
 *                 role: "SUPER_ADMIN"
 *     responses:
 *       '200':
 *         description: User role updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid role update payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Only SUPER_ADMIN may update roles.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/role', authenticate, authorize('SUPER_ADMIN'), validateRoleUpdate, UserController.updateRole);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     tags:
 *       - Administration
 *     summary: Update a user account.
 *     description: Modify user account fields such as name, email, password, or status. Requires ADMIN or SUPER_ADMIN authorization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           examples:
 *             adminUpdate:
 *               value:
 *                 name: "Jane Smith"
 *                 email: "jane.smith+admin@example.com"
 *                 status: "ACTIVE"
 *     responses:
 *       '200':
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid request payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User must have ADMIN or SUPER_ADMIN role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateUserUpdate, UserController.update);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     tags:
 *       - Administration
 *     summary: Delete a user account.
 *     description: Permanently remove a user account from the system. Requires ADMIN or SUPER_ADMIN authorization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier.
 *     responses:
 *       '200':
 *         description: User removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               deleted:
 *                 value:
 *                   success: true
 *                   message: "User deleted successfully."
 *                   data:
 *                     id: "64d0b4d4b6e8f9c3ad2f58c7"
 *                     email: "jane@example.com"
 *                     role: "USER"
 *       '401':
 *         description: Missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: User must have ADMIN or SUPER_ADMIN role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.delete);

export default router;
