import { z } from 'zod';
import { Request, Response } from 'express';
import User from '../models/User';
import Lecture from '../models/Lecture';
import Sessions from '../models/Sessions';

const createSessionSchema = z.object({
  teacherId: z.string(),
  lectureId: z.string(),

  isActive: z.boolean(),
});

const CreateSession = async (req: Request, res: Response) => {
  try {
    const result = createSessionSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    // Check if the teacher exists
    const teacher = await User.findById(result?.data?.teacherId);
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    // Check if the lecture exists
    const lecture = await Lecture.findById(result?.data?.lectureId);
    if (!lecture) {
      return res.status(400).json({ message: 'Lecture not found' });
    }

    // Create a new session
    const newSession = await Sessions.create({
      ...result.data,
      isActive: true, // Set active to true when session is created
    });

    // Schedule deactivation after 4 minutes (240,000 milliseconds)
    setTimeout(async () => {
      console.log(`Trying to mark session ${newSession._id} inactive...`);
      try {
        await Sessions.findByIdAndUpdate(newSession._id, { isActive: false });
        console.log(`Session ${newSession._id} is now inactive.`);
      } catch (error) {
        console.error(
          `Error updating session ${newSession._id} to inactive:`,
          error
        );
      }
    }, 240000); // 240000 milliseconds = 4 minutes

    return res.status(201).json({
      Success: true,
      newSession,
      message: 'Session created successfully',
      sessionId: newSession._id,
    });
  } catch (error) {
    console.error('Create session error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating session',
    });
  }
};

export { CreateSession };
