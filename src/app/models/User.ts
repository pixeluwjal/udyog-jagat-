import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['job_seeker', 'job_poster', 'referrer', 'admin'],
      required: true,
    },
    referralCodeUsed: {
      type: String,
      required: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Referral', // or 'User' if needed
    },
    accessExpiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
