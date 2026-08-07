import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' }
}, {
  timestamps: true
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
