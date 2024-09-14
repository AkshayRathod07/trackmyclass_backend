import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { config } from '../db/config';
import { sign } from 'jsonwebtoken';

const signupSchema = z.object({
  firstName: z.string().max(20).min(2),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'admin', 'superAdmin']),
  profilePic: z.string(),
  phoneNumber: z.string().max(10),
});

const signup = async (req: Request, res: Response) => {
  try {
    // Validate the request data
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    // Destructure the validated data and hash the password
    const validatedData = result.data;
    const { password, ...rest } = validatedData; // Extract password from the rest of the fields
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Check if the user already exists
    const existing = await User.findOne({ email: rest.email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user by combining rest of the data with the hashed password
    const user = await User.create({ ...rest, password: hashedPassword });

    //Token Generation
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      accessToken: token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: 'for signIn' });
};

export { signup, signIn };
