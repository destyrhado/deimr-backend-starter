declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: {
        id: string;
        email: string;
        role: import('../types/http.js').UserRole;
      };
    }
  }
}

export {};
