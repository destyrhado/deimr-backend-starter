import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  tokenHash: string;
  userId: string;
  tokenFamilyId: string;
  expiresAt: Date;
  revokedAt?: Date;
  replacedByTokenHash?: string;
  reuseDetectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    tokenFamilyId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedByTokenHash: { type: String },
    reuseDetectedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

refreshTokenSchema.index({ userId: 1, tokenFamilyId: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken: Model<IRefreshToken> = mongoose.model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
);
