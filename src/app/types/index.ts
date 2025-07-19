import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = mongoose.Document<IUser>;

// Referral types
export interface IReferral {
  _id: string;
  email: string;
  code: string;
  status: 'pending' | 'approved';
  createdAt: Date;
  updatedAt: Date;
}

export type ReferralDocument = mongoose.Document<IReferral>;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}