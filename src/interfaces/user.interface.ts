import type { UserRole } from '../constants/roles.js';

export interface IUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
