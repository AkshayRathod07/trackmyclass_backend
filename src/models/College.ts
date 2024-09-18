import { Schema, model, Document } from 'mongoose';

// Interface to define the College document structure
interface ICollege extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

// College schema
const CollegeSchema = new Schema<ICollege>({
  name: { type: String, required: true, unique: true }, // College name must be unique
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  location: {
    latitude: { type: Number, required: true }, // Location (latitude)
    longitude: { type: Number, required: true }, // Location (longitude)
  },
});

// College model
const CollegeModel = model<ICollege>('College', CollegeSchema);

export default CollegeModel;
