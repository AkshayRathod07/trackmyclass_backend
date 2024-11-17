import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Organization
interface IOorganization extends Document {
  name: string;
  isActive: boolean;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
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
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
        unique: true,
      },
      longitude: {
        type: Number,
        required: true,
        unique: true,
      },
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model<IOorganization>(
  'Organization',
  organizationSchema
);

export default Organization;
