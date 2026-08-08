import type { ValidationError } from '../types/http.js';

export class HttpError extends Error {
  statusCode: number;
  errors?: ValidationError[];

  constructor(statusCode: number, message: string, errors?: ValidationError[]) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const createHttpError = (
  statusCode: number,
  message: string,
  errors?: ValidationError[],
) => new HttpError(statusCode, message, errors);
