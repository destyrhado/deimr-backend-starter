import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateLogin, validateRefresh, validateRegister } from '../validators/auth.validator.js';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user account.
 *     description: Create a new user account with a full name, email address, and strong password. This endpoint is public and returns basic account details after registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             user:
 *               value:
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 password: "StrongPassword123!"
 *     responses:
 *       '201':
 *         description: User account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "User account created successfully."
 *                   data:
 *                     id: "64d0b4d4b6e8f9c3ad2f58c7"
 *                     name: "John Doe"
 *                     email: "john@example.com"
 *                     role: "USER"
 *                     status: "ACTIVE"
 *                     createdAt: "2026-08-08T00:00:00.000Z"
 *                     updatedAt: "2026-08-08T00:00:00.000Z"
 *       '400':
 *         description: Invalid registration payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidRequest:
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Invalid registration data"
 *       '409':
 *         description: Account already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               conflict:
 *                 value:
 *                   success: false
 *                   statusCode: 409
 *                   message: "User already exists"
 *       '429':
 *         description: Too many registration attempts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Server error while creating user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', validateRegister, AuthController.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user and return access tokens.
 *     description: Verify credentials for a regular user, administrator, or super administrator and return access and refresh tokens for authenticated sessions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             regularUser:
 *               value:
 *                 email: "user@example.com"
 *                 password: "StrongPassword123!"
 *             administrator:
 *               value:
 *                 email: "admin@example.com"
 *                 password: "StrongPassword123!"
 *             superAdministrator:
 *               value:
 *                 email: "superadmin@example.com"
 *                 password: "StrongPassword123!"
 *     responses:
 *       '200':
 *         description: Credentials validated and tokens issued.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *             examples:
 *               authSuccess:
 *                 value:
 *                   success: true
 *                   message: "Login successful."
 *                   data:
 *                     accessToken: "eyJhbGciOi..."
 *                     refreshToken: "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4"
 *                     user:
 *                       id: "64d0b4d4b6e8f9c3ad2f58c7"
 *                       name: "John Doe"
 *                       email: "john@example.com"
 *                       role: "USER"
 *                       status: "ACTIVE"
 *                       createdAt: "2026-08-08T00:00:00.000Z"
 *                       updatedAt: "2026-08-08T00:00:00.000Z"
 *       '400':
 *         description: Invalid login payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidRequest:
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Invalid login data"
 *       '401':
 *         description: Incorrect credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   statusCode: 401
 *                   message: "Invalid credentials"
 *       '429':
 *         description: Too many login attempts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh an access token using a valid refresh token.
 *     description: Exchange a valid refresh token for a new access token and refresh token pair without requiring the user to re-enter credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenRequest'
 *           examples:
 *             refreshRequest:
 *               value:
 *                 refreshToken: "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4"
 *     responses:
 *       '200':
 *         description: New tokens issued successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *             examples:
 *               refreshSuccess:
 *                 value:
 *                   success: true
 *                   message: "Token refreshed successfully."
 *                   data:
 *                     accessToken: "eyJhbGciOi..."
 *                     refreshToken: "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4"
 *                     user:
 *                       id: "64d0b4d4b6e8f9c3ad2f58c7"
 *                       name: "John Doe"
 *                       email: "john@example.com"
 *                       role: "USER"
 *                       status: "ACTIVE"
 *                       createdAt: "2026-08-08T00:00:00.000Z"
 *                       updatedAt: "2026-08-08T00:00:00.000Z"
 *       '400':
 *         description: Malformed refresh request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Refresh token invalid, expired, or revoked.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidToken:
 *                 value:
 *                   success: false
 *                   statusCode: 401
 *                   message: "Refresh token is invalid or expired"
 *       '429':
 *         description: Too many refresh attempts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', validateRefresh, AuthController.refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Revoke a refresh token and end the session.
 *     description: Invalidate a refresh token so it cannot be used again to obtain new access tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenRequest'
 *           examples:
 *             logoutRequest:
 *               value:
 *                 refreshToken: "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4"
 *     responses:
 *       '200':
 *         description: Refresh token revoked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               logoutSuccess:
 *                 value:
 *                   success: true
 *                   message: "Logout successful."
 *                   data: { revoked: true }
 *       '400':
 *         description: Invalid logout request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Refresh token invalid or already revoked.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', validateRefresh, AuthController.logout);

export default router;
