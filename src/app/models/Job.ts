import { Schema, model, models } from 'mongoose';

const JobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']
  },
  skillsRequired: { type: [String], default: [] },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'expired', 'filled'],
    default: 'active'
  },
  applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for applications count
JobSchema.virtual('applicationsCount').get(function() {
  return this.applications?.length || 0;
});

// Create indexes
JobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });
JobSchema.index({ postedBy: 1 });
JobSchema.index({ expiresAt: 1 });
JobSchema.index({ status: 1 });

export default models.Job || model('Job', JobSchema);