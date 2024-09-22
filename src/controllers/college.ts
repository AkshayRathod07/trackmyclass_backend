import { Request, Response } from 'express';
import CollegeModel from '../models/College';
import { z } from 'zod';

const collegeSchema = z.object({
  name: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

const createCollege = async (req: Request, res: Response) => {
  try {
    // Validate the request data
    const result = collegeSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    const { name, address, location } = result.data;

    // Create a new college instance
    const newCollege = new CollegeModel({
      name,
      address,
      location,
    });

    // Save the college to the database
    const savedCollege = await newCollege.save();

    // Respond with the created college
    res
      .status(201)
      .json({ message: 'College created successfully', college: savedCollege });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { createCollege };
