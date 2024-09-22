import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Organization
interface IOorganization extends Document {
  name: string;
  isActive: boolean;
}

// Create schema for Organization
const organizationSchema: Schema<IOorganization> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model<IOorganization>(
  'Organization',
  organizationSchema
);

export default Organization;
