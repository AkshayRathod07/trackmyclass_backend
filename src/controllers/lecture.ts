import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import Lecture from '../models/Lecture';
import { AuthRequest } from '../middleware/auth';

const createLectureSchema = z.object({
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

    const teacherId = (req as AuthRequest).userId;

    console.log('result:', result);

    // Check if the teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    // create a new lecture
    const newLecture = await Lecture.create({
      ...result.data,
      organizationId: (req as AuthRequest).organizationId,
      teacherId,
    });

    return res.status(201).json({
      Success: true,
      message: 'Lecture created successfully',
      lectureId: newLecture._id,
      teacherId: teacherId,
    });
  } catch (error) {
    console.error('Create lecture error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating lecture',
    });
  }
};

// get lecture
const getLecture = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as AuthRequest).organizationId;
    console.log('organizationId:', organizationId);

    const lectures = await Lecture.find({ organizationId });
    console.log('lectures:', lectures);

    return res.status(200).json({ lectures });
  } catch (error) {
    console.error('Get lecture error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching lectures',
    });
  }
};

// delete lecture
const deleteLecture = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    return res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    console.error('Delete lecture error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting lecture',
    });
  }
};

export { createLecture, getLecture, deleteLecture };
