export interface IRefreshTokenPayload {
  token: string;
  userId: string;
  expiresAt: Date;
  revokedAt?: Date;
}
