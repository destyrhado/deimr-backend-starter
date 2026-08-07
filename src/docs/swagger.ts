import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Deimr Backend Starter API',
    version: '1.0.0',
    description: 'Production-quality API documentation for the Deimr backend starter. This API supports JWT authentication, user profile management, administrative user controls, and system health checks.'
  },
  servers: [
    { url: 'https://deimr-backend-starter.onrender.com', description: 'Production' },
    { url: 'http://localhost:5001', description: 'Local development' }
  ],
  tags: [
    { name: 'Authentication', description: 'Authentication and token lifecycle operations' },
    { name: 'Users', description: 'Current user profile and account management' },
    { name: 'Administration', description: 'Administrator user management operations' },
    { name: 'Super Administration', description: 'SUPER_ADMIN-only user role management operations' },
    { name: 'System', description: 'Application health and operational status endpoints' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        description: 'Authenticated user account representation.',
        properties: {
          id: { type: 'string', description: 'Unique user identifier.' },
          name: { type: 'string', description: 'Full user name.' },
          email: { type: 'string', format: 'email', description: 'User email address.' },
          role: { type: 'string', description: 'User role within the application.', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
          status: { type: 'string', description: 'User account status.', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
          createdAt: { type: 'string', format: 'date-time', description: 'Account creation timestamp.' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last account update timestamp.' }
        },
        required: ['id', 'name', 'email', 'role', 'status', 'createdAt', 'updatedAt']
      },
      RegisterRequest: {
        type: 'object',
        description: 'Payload used to create a new user account.',
        properties: {
          name: { type: 'string', description: 'Full name of the user.' },
          email: { type: 'string', format: 'email', description: 'Email address for login.' },
          password: { type: 'string', description: 'Strong password for the account.' }
        },
        required: ['name', 'email', 'password']
      },
      LoginRequest: {
        type: 'object',
        description: 'Credentials used to authenticate an existing user.',
        properties: {
          email: { type: 'string', format: 'email', description: 'Registered user email.' },
          password: { type: 'string', description: 'User password.' }
        },
        required: ['email', 'password']
      },
      TokenRequest: {
        type: 'object',
        description: 'Request payload for refresh or logout token operations.',
        properties: {
          refreshToken: { type: 'string', description: 'Refresh token returned by login.' }
        },
        required: ['refreshToken']
      },
      UpdateUserRequest: {
        type: 'object',
        description: 'Fields available to update for a user profile or managed account.',
        properties: {
          name: { type: 'string', description: 'Updated full name.' },
          email: { type: 'string', format: 'email', description: 'Updated email address.' },
          password: { type: 'string', description: 'New password for the account.' },
          status: { type: 'string', description: 'Updated account status. Only administrators may set this.', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] }
        }
      },
      RoleUpdateRequest: {
        type: 'object',
        description: 'Payload for promoting or demoting a user role.',
        properties: {
          role: { type: 'string', description: 'Target role for the user.', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
        },
        required: ['role']
      },
      PaginationMeta: {
        type: 'object',
        description: 'Pagination metadata for list responses.',
        properties: {
          page: { type: 'integer', description: 'Current page number.' },
          limit: { type: 'integer', description: 'Maximum results per page.' },
          total: { type: 'integer', description: 'Total number of matching records.' },
          pages: { type: 'integer', description: 'Total number of pages available.' }
        },
        required: ['page', 'limit', 'total', 'pages']
      },
      AuthenticationResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Authentication successful.' },
          data: {
            type: 'object',
            properties: {
              accessToken: { type: 'string', description: 'JWT access token.' },
              refreshToken: { type: 'string', description: 'JWT refresh token.' },
              user: { $ref: '#/components/schemas/User' }
            }
          }
        }
      },
      UserResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'User loaded successfully.' },
          data: { $ref: '#/components/schemas/User' }
        }
      },
      UserListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Users loaded successfully.' },
          data: {
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              },
              meta: { $ref: '#/components/schemas/PaginationMeta' }
            }
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully.' },
          data: { type: 'object', example: {} }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 403 },
          message: { type: 'string', example: 'Forbidden' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Retrieve application health status.',
        description: 'Returns operational service health information for uptime checks and readiness monitoring.',
        responses: {
          '200': {
            description: 'The application is healthy and responding.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                examples: {
                  success: {
                    value: {
                      success: true,
                      message: 'Service is operational.',
                      data: { status: 'ok', service: 'deimr-backend-starter' }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Unexpected server error.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  error: {
                    value: {
                      success: false,
                      statusCode: 500,
                      message: 'Internal Server Error'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['./src/routes/**/*.ts', './src/docs/**/*.ts']
});
