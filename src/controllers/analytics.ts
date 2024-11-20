import { NextFunction, Request, Response } from 'express';
import Attendance from '../models/Attendance';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import moment from 'moment';

// export const getDailyAnalytics = async (req: Request, res: Response) => {
//   try {
//     // const { totalStudents } = req.query;

//     // Fallback to hardcoded value if not passed from frontend
//     // const TOTAL_STUDENTS = totalStudents ? parseInt(totalStudents as string) : 60;

//     // Fetch daily attendance analytics
//     const analytics = await Attendance.aggregate([
//       {
//         $group: {
//           _id: {
//             date: { $dateToString: { format: '%Y-%m-%d', date: '$markedAt' } },
//             sessionId: '$sessionId',
//           },
//           presentStudents: {
//             $sum: {
//               $cond: [{ $eq: ['$status', 'Present'] }, 1, 0],
//             },
//           },
//           totalStudents: { $sum: 1 },
//         },
//       },
//       {
//         $group: {
//           _id: '$_id.date',
//           totalLectures: { $sum: 1 },
//           presentStudents: { $sum: '$presentStudents' },
//           totalStudents: { $sum: '$totalStudents' },
//         },
//       },
//       { $sort: { _id: 1 } }, // Sort by date
//     ]);

//     const totalStudents = await User.countDocuments({
//       role: 'STUDENT',
//       organizationId: (req as AuthRequest).organizationId,
//     });

//     console.log('totalStudents:', totalStudents);

//     // Format the response
//     const formattedAnalytics = analytics.map((entry) => ({
//       date: entry._id,
//       totalLectures: entry.totalLectures,
//       presentStudents: entry.presentStudents,
//       totalStudents: totalStudents,
//     }));

//     res.status(200).json({ attendance: formattedAnalytics });
//   } catch (error) {
//     console.error('Error generating daily analytics:', error);
//     res.status(500).json({ error: 'Failed to fetch daily analytics' });
//   }
// };
// todays data only
const getDailyAnalytics = async (req: Request, res: Response) => {
  try {
    const today = moment().startOf('day').toDate(); // Get start of today's date
    const tomorrow = moment().endOf('day').toDate(); // Get end of today's date

    const analytics = await Attendance.aggregate([
      { $match: { markedAt: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: '$sessionId',
          presentStudents: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Present'] }, 1, 0],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLectures: { $sum: 1 },
          presentStudents: { $sum: '$presentStudents' },
        },
      },
    ]);

    const totalStudents = await User.countDocuments({
      role: 'STUDENT',
      organizationId: (req as AuthRequest).organizationId,
    });

    res.status(200).json({
      date: moment(today).format('YYYY-MM-DD'),
      totalLectures: analytics[0]?.totalLectures || 0,
      presentStudents: analytics[0]?.presentStudents || 0,
      totalStudents: totalStudents,
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

const getAllDatesAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await Attendance.aggregate([
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

export { getDailyAnalytics, getWeeklyAnalytics, getAllDatesAnalytics };
