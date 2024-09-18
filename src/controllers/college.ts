import { Request, Response } from 'express';
import CollegeModel from '../models/College';

const createCollege = async (req: Request, res: Response) => {
  try {
    const { name, address, location } = req.body;

    // Validate request body
    if (!name || !address || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

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
