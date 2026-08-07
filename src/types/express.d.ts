declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: import('../types/http.js').UserRole;
      };
    }
  }
}

export {};
