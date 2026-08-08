import swaggerJSDoc from 'swagger-jsdoc';
import { API_VERSION, SERVICE_NAME } from '../constants/api.js';
import { env } from '../config/env.js';

const schemaRef = (name: string) => `#/components/schemas/${name}`;
const responseRef = (name: string) => `#/components/responses/${name}`;

type Examples = Record<string, { summary?: string; value: unknown }>;

const jsonResponse = (
  description: string,
  schemaName: string,
  examples?: Examples,
) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: schemaRef(schemaName) },
      ...(examples ? { examples } : {}),
    },
  },
});

const textResponse = (description: string, example: string) => ({
  description,
  content: {
    'text/plain': {
      schema: {
        type: 'string',
        example,
      },
    },
  },
});

const serverUrl =
  env.nodeEnv === 'production' ? env.appUrl : `http://localhost:${env.port}`;

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Deimr Backend Starter API',
    version: API_VERSION,
    description:
      'Production-ready API documentation for the Deimr Backend Starter. Built with Node.js, TypeScript, Express.js, MongoDB Atlas, secure JWT authentication, RBAC, validation, testing, and deployment workflows.',
    contact: {
      name: 'Ibrahim Destiny',
      url: 'https://github.com/destyrhado',
    },
    license: {
      name: 'MIT',
    },
  },
  externalDocs: {
    description: 'GitHub repository',
    url: 'https://github.com/destyrhado/deimr-backend-starter',
  },
  servers: [
    {
      url: serverUrl,
      description: env.nodeEnv === 'production' ? 'Production' : 'Development',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description:
        'Public registration, login, refresh, and logout token lifecycle operations.',
    },
    {
      name: 'Users',
      description:
        'Authenticated profile operations for USER, ADMIN, and SUPER_ADMIN roles.',
    },
    {
      name: 'Administration',
      description:
        'User management operations restricted to ADMIN and SUPER_ADMIN roles.',
    },
    {
      name: 'Super Administration',
      description:
        'Role management restricted to SUPER_ADMIN. The API also blocks changing your own role and demoting another SUPER_ADMIN.',
    },
    {
      name: 'System',
      description: 'Service health and operational status endpoints.',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste the accessToken returned by POST /api/v1/auth/login or POST /api/v1/auth/refresh.',
      },
    },
    schemas: {
      User: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string', example: '66b7f1a2c0a4f7b5f0d9a111' },
          name: { type: 'string', example: 'Jane Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.test',
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
            example: 'USER',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            example: 'ACTIVE',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-08-08T00:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-08-08T00:00:00.000Z',
          },
        },
        required: [
          'id',
          'name',
          'email',
          'role',
          'status',
          'createdAt',
          'updatedAt',
        ],
      },
      RegisterRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, example: 'Jane Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.test',
          },
          password: {
            type: 'string',
            minLength: 8,
            format: 'password',
            example: 'ExamplePassword123!',
          },
        },
        required: ['name', 'email', 'password'],
      },
      LoginRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
        required: ['email', 'password'],
      },
      TokenRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Refresh token returned by login or refresh.',
          },
        },
        required: ['refreshToken'],
      },
      ProfileUpdateRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, example: 'Jane Smith' },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane.smith@example.test',
          },
          password: {
            type: 'string',
            minLength: 8,
            format: 'password',
            example: 'ExamplePassword123!',
          },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, example: 'Jane Smith' },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane.smith@example.test',
          },
          password: {
            type: 'string',
            minLength: 8,
            format: 'password',
            example: 'ExamplePassword123!',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            example: 'ACTIVE',
          },
        },
        description:
          'Administrator user updates. Role changes are handled only by PATCH /api/v1/users/{id}/role.',
      },
      RoleUpdateRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
            example: 'ADMIN',
          },
        },
        required: ['role'],
      },
      ValidationError: {
        type: 'object',
        additionalProperties: false,
        properties: {
          field: { type: 'string', example: 'email' },
          message: {
            type: 'string',
            example: 'Email must be a valid email address.',
          },
        },
        required: ['field', 'message'],
      },
      ErrorResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [false], example: false },
          message: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'integer', example: 401 },
          requestId: {
            type: 'string',
            example: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
          },
          errors: {
            type: 'array',
            items: { $ref: schemaRef('ValidationError') },
          },
        },
        required: ['success', 'message', 'statusCode', 'requestId'],
      },
      PaginationResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          page: { type: 'integer', minimum: 1, example: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, example: 20 },
          total: { type: 'integer', minimum: 0, example: 42 },
          pages: { type: 'integer', minimum: 0, example: 3 },
          hasNextPage: { type: 'boolean', example: true },
          hasPreviousPage: { type: 'boolean', example: false },
        },
        required: [
          'page',
          'limit',
          'total',
          'pages',
          'hasNextPage',
          'hasPreviousPage',
        ],
      },
      AuthResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            additionalProperties: false,
            properties: {
              accessToken: {
                type: 'string',
                description:
                  'JWT access token. Paste this value into Swagger Authorize.',
              },
              refreshToken: {
                type: 'string',
                description:
                  'Refresh token for POST /api/v1/auth/refresh and POST /api/v1/auth/logout.',
              },
              user: { $ref: schemaRef('User') },
            },
            required: ['accessToken', 'refreshToken', 'user'],
          },
          statusCode: { type: 'integer', example: 200 },
        },
        required: ['success', 'message', 'data', 'statusCode'],
      },
      UserResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: { type: 'string', example: 'User loaded successfully' },
          data: { $ref: schemaRef('User') },
          statusCode: { type: 'integer', example: 200 },
        },
        required: ['success', 'message', 'data', 'statusCode'],
      },
      RoleUpdateResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: { type: 'string', example: 'Role updated successfully' },
          data: { $ref: schemaRef('User') },
          statusCode: { type: 'integer', example: 200 },
        },
        required: ['success', 'message', 'data', 'statusCode'],
      },
      UserListResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: { type: 'string', example: 'Users loaded successfully' },
          data: {
            type: 'object',
            additionalProperties: false,
            properties: {
              users: {
                type: 'array',
                items: { $ref: schemaRef('User') },
              },
              pagination: { $ref: schemaRef('PaginationResponse') },
            },
            required: ['users', 'pagination'],
          },
          statusCode: { type: 'integer', example: 200 },
        },
        required: ['success', 'message', 'data', 'statusCode'],
      },
      DeleteUserResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: { type: 'string', example: 'User deleted successfully' },
          data: {
            type: 'object',
            additionalProperties: false,
            properties: {
              id: { type: 'string', example: '66b7f1a2c0a4f7b5f0d9a111' },
              email: {
                type: 'string',
                format: 'email',
                example: 'jane@example.test',
              },
              role: {
                type: 'string',
                enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
                example: 'USER',
              },
            },
            required: ['id', 'email', 'role'],
          },
          statusCode: { type: 'integer', example: 200 },
        },
        required: ['success', 'message', 'data', 'statusCode'],
      },
      LogoutResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: { type: 'string', example: 'Logout successful' },
          data: {
            type: 'object',
            additionalProperties: false,
            properties: {
              revoked: { type: 'boolean', enum: [true], example: true },
            },
            required: ['revoked'],
          },
          statusCode: { type: 'integer', example: 200 },
        },
        required: ['success', 'message', 'data', 'statusCode'],
      },
      RootResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', enum: [true], example: true },
          message: {
            type: 'string',
            example: 'Deimr Backend Starter API is running.',
          },
        },
        required: ['success', 'message'],
      },
      HealthResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          service: { type: 'string', example: SERVICE_NAME },
          environment: { type: 'string', example: 'development' },
          version: { type: 'string', example: API_VERSION },
          status: { type: 'string', enum: ['ok'], example: 'ok' },
          uptime: { type: 'number', minimum: 0, example: 12.345 },
        },
        required: ['service', 'environment', 'version', 'status', 'uptime'],
      },
    },
    responses: {
      ValidationErrorResponse: jsonResponse(
        'Request validation failed.',
        'ErrorResponse',
        {
          invalidFields: {
            value: {
              success: false,
              message: 'Invalid login data',
              statusCode: 400,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
              errors: [
                {
                  field: 'email',
                  message: 'A valid email address is required.',
                },
              ],
            },
          },
        },
      ),
      InvalidUserId: jsonResponse(
        'The provided user id is not a valid MongoDB ObjectId.',
        'ErrorResponse',
        {
          invalidId: {
            value: {
              success: false,
              message: 'Invalid user id',
              statusCode: 400,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
              errors: [
                {
                  field: 'id',
                  message: 'User id must be a valid MongoDB ObjectId.',
                },
              ],
            },
          },
        },
      ),
      Unauthorized: jsonResponse(
        'Unauthenticated request. The Bearer access token is missing, malformed, invalid, or expired.',
        'ErrorResponse',
        {
          missingBearerToken: {
            value: {
              success: false,
              message: 'Unauthorized',
              statusCode: 401,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
      InvalidCredentials: jsonResponse(
        'Login credentials are missing from storage or do not match an account.',
        'ErrorResponse',
        {
          invalidCredentials: {
            value: {
              success: false,
              message: 'Invalid credentials',
              statusCode: 401,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
      InvalidRefreshToken: jsonResponse(
        'Refresh token is invalid, expired, revoked, reused, or not stored by the API.',
        'ErrorResponse',
        {
          invalidRefreshToken: {
            value: {
              success: false,
              message: 'Refresh token is invalid or expired',
              statusCode: 401,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
      Forbidden: jsonResponse(
        'Authenticated user does not have sufficient permission for this endpoint.',
        'ErrorResponse',
        {
          forbidden: {
            value: {
              success: false,
              message: 'You do not have permission to access this resource.',
              statusCode: 403,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
      NotFound: jsonResponse(
        'Requested resource was not found.',
        'ErrorResponse',
        {
          notFound: {
            value: {
              success: false,
              message: 'User not found',
              statusCode: 404,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
      Conflict: jsonResponse(
        'The requested email address is already used by another account.',
        'ErrorResponse',
        {
          conflict: {
            value: {
              success: false,
              message: 'User already exists',
              statusCode: 409,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
      TooManyRequests: jsonResponse('Rate limit exceeded.', 'ErrorResponse', {
        tooManyRequests: {
          value: {
            success: false,
            message: 'Too many requests, please try again later.',
            statusCode: 429,
            requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
          },
        },
      }),
      ServerError: jsonResponse(
        'Unexpected server error. Production responses do not include stack traces.',
        'ErrorResponse',
        {
          internalServerError: {
            value: {
              success: false,
              message: 'Internal Server Error',
              statusCode: 500,
              requestId: '7a0f8a9e-2c18-41e7-8b0b-37ef5b83e823',
            },
          },
        },
      ),
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['System'],
        summary: 'Get API root status.',
        description: 'Returns a public status message for the API root.',
        responses: {
          '200': jsonResponse('API root status returned.', 'RootResponse'),
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Get production health status.',
        description:
          'Returns service, environment, version, status, and process uptime for uptime monitoring.',
        responses: {
          '200': jsonResponse('Service is healthy.', 'HealthResponse'),
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/metrics': {
      get: {
        tags: ['System'],
        summary: 'Get process metrics.',
        description:
          'Returns Prometheus-style HTTP request counters for lightweight runtime observability.',
        responses: {
          '200': textResponse(
            'Metrics returned in text/plain format.',
            [
              '# HELP deimr_http_requests_total Total HTTP responses served by this process.',
              '# TYPE deimr_http_requests_total counter',
              'deimr_http_requests_total 42',
            ].join('\n'),
          ),
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a USER account.',
        description:
          'Public endpoint. New accounts are always created with the USER role.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('RegisterRequest') },
              examples: {
                USER: {
                  value: {
                    name: 'Jane Doe',
                    email: 'user@example.test',
                    password: 'ExamplePassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': jsonResponse('User registered successfully.', 'UserResponse', {
            registered: {
              value: {
                success: true,
                message: 'User registered successfully',
                data: {
                  id: '66b7f1a2c0a4f7b5f0d9a111',
                  name: 'Jane Doe',
                  email: 'user@example.test',
                  role: 'USER',
                  status: 'ACTIVE',
                  createdAt: '2026-08-08T00:00:00.000Z',
                  updatedAt: '2026-08-08T00:00:00.000Z',
                },
                statusCode: 201,
              },
            },
          }),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '409': { $ref: responseRef('Conflict') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate and issue tokens.',
        description:
          'Public endpoint. On success, paste data.accessToken into Swagger Authorize to call protected endpoints.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('LoginRequest') },
              examples: {
                USER: {
                  value: {
                    email: 'user@example.test',
                    password: 'ExamplePassword123!',
                  },
                },
                ADMIN: {
                  value: {
                    email: 'admin@example.test',
                    password: 'ExamplePassword123!',
                  },
                },
                SUPER_ADMIN: {
                  value: {
                    email: 'superadmin@example.test',
                    password: 'ExamplePassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': jsonResponse(
            'Credentials validated and access/refresh tokens issued.',
            'AuthResponse',
          ),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('InvalidCredentials') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access and refresh tokens.',
        description:
          'Public endpoint. Requires a stored, unexpired, unrevoked refresh token returned by login or refresh. Reusing a rotated token revokes the token family.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('TokenRequest') },
              examples: {
                refresh: {
                  value: {
                    refreshToken: '<refresh-token-from-login>',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': jsonResponse(
            'New tokens issued successfully.',
            'AuthResponse',
          ),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('InvalidRefreshToken') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Revoke a refresh token.',
        description:
          'Public endpoint. Requires a stored, unexpired, unrevoked refresh token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('TokenRequest') },
              examples: {
                logout: {
                  value: {
                    refreshToken: '<refresh-token-from-login>',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': jsonResponse(
            'Refresh token revoked successfully.',
            'LogoutResponse',
          ),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('InvalidRefreshToken') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get authenticated profile.',
        description:
          'Requires a valid Bearer access token for USER, ADMIN, or SUPER_ADMIN.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': jsonResponse(
            'Authenticated user profile returned.',
            'UserResponse',
          ),
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '404': { $ref: responseRef('NotFound') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update authenticated profile.',
        description:
          'Requires a valid Bearer access token for USER, ADMIN, or SUPER_ADMIN. Profile updates may change only name, email, and password.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ProfileUpdateRequest') },
              examples: {
                profileUpdate: {
                  value: {
                    name: 'Jane Smith',
                    email: 'jane.smith@example.test',
                    password: 'ExamplePassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': jsonResponse('Profile updated successfully.', 'UserResponse'),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '404': { $ref: responseRef('NotFound') },
          '409': { $ref: responseRef('Conflict') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/users': {
      get: {
        tags: ['Administration'],
        summary: 'List users.',
        description:
          'Requires a valid Bearer access token for ADMIN or SUPER_ADMIN. Supports pagination, search, role/status filtering, and whitelisted sorting.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description:
              'Page number. Must be an integer greater than or equal to 1.',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Users per page. Must be an integer from 1 to 100.',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Case-insensitive search across name and email.',
          },
          {
            in: 'query',
            name: 'role',
            schema: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
            description:
              'Case-insensitive role filter. Runtime normalizes to uppercase.',
          },
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            },
            description:
              'Case-insensitive account status filter. Runtime normalizes to uppercase.',
          },
          {
            in: 'query',
            name: 'sort',
            schema: {
              type: 'string',
              enum: [
                'name',
                '-name',
                'email',
                '-email',
                'role',
                '-role',
                'status',
                '-status',
                'createdAt',
                '-createdAt',
                'updatedAt',
                '-updatedAt',
              ],
              default: '-createdAt',
            },
            description:
              'Sort by one allowed field. Prefix with "-" for descending order.',
          },
        ],
        responses: {
          '200': jsonResponse(
            'Paginated user list returned.',
            'UserListResponse',
          ),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/users/{id}': {
      get: {
        tags: ['Administration'],
        summary: 'Get a user by id.',
        description:
          'Requires a valid Bearer access token for ADMIN or SUPER_ADMIN.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the user.',
          },
        ],
        responses: {
          '200': jsonResponse('User account details returned.', 'UserResponse'),
          '400': { $ref: responseRef('InvalidUserId') },
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '404': { $ref: responseRef('NotFound') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
      patch: {
        tags: ['Administration'],
        summary: 'Update a user.',
        description:
          'Requires a valid Bearer access token for ADMIN or SUPER_ADMIN. This endpoint cannot change user roles.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the user.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('UpdateUserRequest') },
              examples: {
                adminUpdate: {
                  value: {
                    name: 'Jane Smith',
                    email: 'jane.smith@example.test',
                    status: 'ACTIVE',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': jsonResponse('User updated successfully.', 'UserResponse'),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '404': { $ref: responseRef('NotFound') },
          '409': { $ref: responseRef('Conflict') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
      delete: {
        tags: ['Administration'],
        summary: 'Delete a user.',
        description:
          'Requires a valid Bearer access token for ADMIN or SUPER_ADMIN. The service rejects deleting your own authenticated account.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the user.',
          },
        ],
        responses: {
          '200': jsonResponse(
            'User deleted successfully.',
            'DeleteUserResponse',
          ),
          '400': { $ref: responseRef('InvalidUserId') },
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '404': { $ref: responseRef('NotFound') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
    '/api/v1/users/{id}/role': {
      patch: {
        tags: ['Super Administration'],
        summary: 'Update a user role.',
        description:
          'Requires a valid Bearer access token for SUPER_ADMIN. The service also rejects changing your own role and rejects changing another SUPER_ADMIN to a lower role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId of the user.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: schemaRef('RoleUpdateRequest') },
              examples: {
                promoteToAdmin: {
                  value: { role: 'ADMIN' },
                },
                promoteToSuperAdmin: {
                  value: { role: 'SUPER_ADMIN' },
                },
                demoteToUser: {
                  value: { role: 'USER' },
                },
              },
            },
          },
        },
        responses: {
          '200': jsonResponse(
            'Role updated successfully.',
            'RoleUpdateResponse',
          ),
          '400': { $ref: responseRef('ValidationErrorResponse') },
          '401': { $ref: responseRef('Unauthorized') },
          '403': { $ref: responseRef('Forbidden') },
          '404': { $ref: responseRef('NotFound') },
          '429': { $ref: responseRef('TooManyRequests') },
          '500': { $ref: responseRef('ServerError') },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
});
