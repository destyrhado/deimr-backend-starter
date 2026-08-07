import { ApiResponse } from '../types/http.js';

export const sendSuccess = <T>(message: string, data?: T, statusCode = 200): ApiResponse<T> => ({
  success: true,
  message,
  data,
  statusCode
});

export const sendError = (message: string, statusCode = 500, errors?: Array<{ field: string; message: string }>): ApiResponse => ({
  success: false,
  message,
  statusCode,
  errors
});
