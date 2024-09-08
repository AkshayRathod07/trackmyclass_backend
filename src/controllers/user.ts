import User from '../models/User';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().max(20).min(2),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'admin', 'superAdmin']),
  profilePic: z.string(),
  phoneNumber: z.string().max(10),
});

const signup = async (req: Request, res: any) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      // modify the error response to be more user-friendly
      const errors = result.error.errors.map((err) => ({
        field: err.path[0], // e.g., 'firstName'
        message: err.message, // e.g., 'String must contain at least 2 character(s)'
      }));

      return res.status(400).json({
        errors, // Simplified array of field-specific error messages
      });
    }
    // If validation succeeded, you can safely use `result.data`
    const validatedData = result?.data;

    // existingUser check logic
    const existing = await User.findOne({ email: validatedData.email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create new user logic using create method
    const user = await User.create(validatedData);

    return res
      .status(201)
      .json({ success: true, message: 'User created successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default signup;
