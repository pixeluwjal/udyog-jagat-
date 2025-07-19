import mongoose from 'mongoose';

const ReferralCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String, // user ID or email of referrer
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ReferralCode || mongoose.model('ReferralCode', ReferralCodeSchema);
