import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import moment from 'moment';

// Today's data analytics
const getDailyAnalytics = async (req: Request, res: Response) => {
  try {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment().endOf('day').toDate();

    // Group by session and collect student data
    const attendanceData = await Attendance.aggregate([
      { $match: { markedAt: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: '$sessionId',
          date: {
            $first: {
              $dateToString: { format: '%Y-%m-%d', date: '$markedAt' },
            },
          },
          studentsPresent: {
            $push: {
              $cond: [{ $eq: ['$status', 'Present'] }, '$studentId', null],
            },
          },
        },
      },
    ]);

    const totalStudents = await User.countDocuments({
      role: 'STUDENT',
      organizationId: (req as AuthRequest).organizationId,
    });

    // Restructure response
    const lectures = attendanceData.map((session) => ({
      date: session.date,
      studentsPresent: session.studentsPresent.filter(Boolean), // Remove nulls
    }));

    res.status(200).json({
      date: moment(today).format('YYYY-MM-DD'),
      totalStudents,
      lectures,
    });
  } catch (error) {
    console.error('Error generating daily analytics:', error);
    res.status(500).json({ error: 'Failed to fetch daily analytics' });
  }
};

// Past 7 days' data
const getWeeklyAnalytics = async (req: Request, res: Response) => {
  try {
    const startOfWeek = moment().startOf('isoWeek').toDate(); // Monday
    const endOfWeek = moment().endOf('isoWeek').toDate(); // Sunday

    const analytics = await Attendance.aggregate([
      { $match: { markedAt: { $gte: startOfWeek, $lt: endOfWeek } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$markedAt' } },
          },
          presentStudents: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Present'] }, 1, 0],
            },
          },
          totalLectures: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    res.status(200).json({
      weekStart: moment(startOfWeek).format('YYYY-MM-DD'),
      weekEnd: moment(endOfWeek).format('YYYY-MM-DD'),
      analytics,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch daily analytics' });
    }
  }
};

// Analytics for all dates
const getAllDatesAnalytics = async (req: Request, res: Response) => {
  try {
    const attendanceData = await Attendance.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$markedAt' } },
            sessionId: '$sessionId',
          },
          studentsPresent: {
            $push: {
              $cond: [{ $eq: ['$status', 'Present'] }, '$studentId', null],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          sessions: {
            $push: {
              sessionId: '$_id.sessionId',
              studentsPresent: '$studentsPresent',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const lectures = attendanceData.map((entry) => ({
      date: entry._id,
      studentsPresent: entry.sessions.map(
        (session: { studentsPresent: (string | null)[] }) =>
          session.studentsPresent.filter(Boolean) // Remove nulls
      ),
    }));

    res.status(200).json({
      lectures,
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export { getDailyAnalytics, getAllDatesAnalytics, getWeeklyAnalytics };
