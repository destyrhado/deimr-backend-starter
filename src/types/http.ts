export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthPayload {
  sub: string;
  role: string;
}
