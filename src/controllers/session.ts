import { z } from 'zod';
import { Request, Response } from 'express';
import User from '../models/User';
import Lecture from '../models/Lecture';
import Sessions from '../models/Sessions';
// import Redis from 'ioredis';
// redis cloud setup
// import Queue from 'bull';

// import { createClient } from 'redis';

// const redisClient = new Redis({
//   host: 'redis-15398.c246.us-east-1-4.ec2.redns.redis-cloud.com',
//   port: 15398,
//   username: 'default',
//   password: 'UuELsQUDAM5TJcHI9Oguefmv5yHORDMM',
// });

// Create a Bull queue using the Redis client
// const sessionQueue = new Queue('session-deactivation', {
//   createClient: () => redisClient, // Use the created Redis client for the queue
// });

// Listen for connection events
// redisClient.on('connect', () => {
//   console.log('Redis client connected successfully.');
// });

// redisClient.on('ready', () => {
//   console.log('Redis client is ready to use.');
// });

// redisClient.on('error', (err) => {
//   console.error('Redis client connection error:', err);
// });

// redisClient.on('end', () => {
//   console.log('Redis client disconnected.');
// });

// Connect the Redis client
// (async () => {
//   try {
//     await redisClient.connect();
//     console.log('Connected to Redis successfully.');
//   } catch (error) {
//     console.error('Error connecting to Redis:', error);
//   }
// })();

// Job processor to mark session inactive
// sessionQueue.process(async (job) => {
//   const sessionId = job.data.sessionId;
//   try {
//     await Sessions.findByIdAndUpdate(sessionId, { isActive: false });
//     console.log(`Session ${sessionId} marked as inactive.`);
//   } catch (error) {
//     console.error(`Error marking session ${sessionId} inactive:`, error);
//   }
// });

const createSessionSchema = z.object({
  teacherId: z.string(),
  lectureId: z.string(),

  isActive: z.boolean(),
});

const CreateSession = async (req: Request, res: Response) => {
  try {
    console.log('started creating session api call');

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

    // disabled the bull queue for now
    // Add a job to the Bull queue to deactivate the session in 4 minutes (240,000ms)
    // sessionQueue.add({ sessionId: newSession._id }, { delay: 240000 });

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

// get all sessions
const getAllSessions = async (req: Request, res: Response) => {
  console.log('started get all sessions api call');

  try {
    const sessions = await Sessions.find({
      isActive: true,
    });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error('Get all sessions error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching sessions',
    });
  }
};

// delete session

const deleteSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await Sessions.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await Sessions.findByIdAndDelete(sessionId);
    return res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    return res.status(500).json({
      message: 'An error occurred while deleting session',
    });
  }
};

export { CreateSession, getAllSessions, deleteSession };
