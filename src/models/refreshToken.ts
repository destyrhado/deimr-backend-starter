import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  userId: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

export const RefreshToken: Model<IRefreshToken> = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
