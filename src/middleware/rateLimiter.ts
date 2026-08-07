import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

interface RateLimitEntry {
  count: number;
  firstRequestAt: number;
}

const requestStore = new Map<string, RateLimitEntry>();

export const apiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = requestStore.get(key) ?? { count: 0, firstRequestAt: now };

  if (now - entry.firstRequestAt > env.rateLimitWindowMs) {
    entry.count = 0;
    entry.firstRequestAt = now;
  }

  entry.count += 1;
  requestStore.set(key, entry);

  if (entry.count > env.rateLimitMax) {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      statusCode: 429
    });
    return;
  }

  next();
};
