"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDatesAnalytics = exports.getWeeklyAnalytics = exports.getDailyAnalytics = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const User_1 = __importDefault(require("../models/User"));
const moment_1 = __importDefault(require("moment"));
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
const getDailyAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const today = (0, moment_1.default)().startOf('day').toDate(); // Get start of today's date
        const tomorrow = (0, moment_1.default)().endOf('day').toDate(); // Get end of today's date
        const analytics = yield Attendance_1.default.aggregate([
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
        const totalStudents = yield User_1.default.countDocuments({
            role: 'STUDENT',
            organizationId: req.organizationId,
        });
        res.status(200).json({
            date: (0, moment_1.default)(today).format('YYYY-MM-DD'),
            totalLectures: ((_a = analytics[0]) === null || _a === void 0 ? void 0 : _a.totalLectures) || 0,
            presentStudents: ((_b = analytics[0]) === null || _b === void 0 ? void 0 : _b.presentStudents) || 0,
            totalStudents: totalStudents,
        });
    }
    catch (error) {
        console.error('Error generating daily analytics:', error);
        res.status(500).json({ error: 'Failed to fetch daily analytics' });
    }
});
exports.getDailyAnalytics = getDailyAnalytics;
// Past 7 days' data
const getWeeklyAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startOfWeek = (0, moment_1.default)().startOf('isoWeek').toDate(); // Monday
        const endOfWeek = (0, moment_1.default)().endOf('isoWeek').toDate(); // Sunday
        const analytics = yield Attendance_1.default.aggregate([
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
            weekStart: (0, moment_1.default)(startOfWeek).format('YYYY-MM-DD'),
            weekEnd: (0, moment_1.default)(endOfWeek).format('YYYY-MM-DD'),
            analytics,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch daily analytics' });
        }
    }
});
exports.getWeeklyAnalytics = getWeeklyAnalytics;
const getAllDatesAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield Attendance_1.default.aggregate([
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch daily analytics' });
        }
    }
});
exports.getAllDatesAnalytics = getAllDatesAnalytics;
