import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole, UserStatus } from '../types/http.js';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ role: 1, status: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
