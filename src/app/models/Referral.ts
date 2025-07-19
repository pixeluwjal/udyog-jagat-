import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforces unique emails
    },
    role: {
      type: String,
      enum: ['job_seeker', 'recruiter', 'referrer'],
      required: true,
    },
    code: {
      type: String,
      required: false,
      // ❌ removed index: true to avoid duplicate
      sparse: true,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Global index: Unique only when `code` exists and is a string
referralSchema.index(
  { code: 1 },
  { 
    unique: true,
    partialFilterExpression: { code: { $type: 'string' } }
  }
);

export default mongoose.models.Referral || mongoose.model('Referral', referralSchema);
