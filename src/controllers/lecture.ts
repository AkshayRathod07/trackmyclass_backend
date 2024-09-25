import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import Lecture from '../models/Lecture';
import Sessions from '../models/Sessions';

const createLectureSchema = z.object({
  teacherId: z.string(),
  startTime: z.string().datetime({
    message: 'Invalid datetime string! Must be UTC.',
  }),
  endTime: z.string().datetime({
    message: 'Invalid datetime string! Must be UTC.',
  }),
  subject: z.string(),
  dayOfWeek: z.string(),
  duration: z.number().optional(),
});

const createLecture = async (req: Request, res: Response) => {
  try {
    const result = createLectureSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    console.log('result:', result);

    // Check if the teacher exists
    const teacher = await User.findById(result?.data?.teacherId);
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    // create a new lecture
    const newLecture = await Lecture.create({
      ...result.data,
    });

    return res.status(201).json({
      newLecture: newLecture,
      message: 'Lecture created successfully',
    });
  } catch (error) {
    console.error('Create lecture error:', error);
  }
};

export { createLecture };
