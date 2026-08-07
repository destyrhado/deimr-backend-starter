export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
  requestId?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface AuthPayload {
  sub: string;
  email: string;
  role: UserRole;
}
