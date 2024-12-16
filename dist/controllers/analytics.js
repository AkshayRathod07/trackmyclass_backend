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
exports.getWeeklyAnalytics = exports.getAllDatesAnalytics = exports.getDailyAnalytics = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const User_1 = __importDefault(require("../models/User"));
const moment_1 = __importDefault(require("moment"));
// Today's data analytics
const getDailyAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = (0, moment_1.default)().startOf('day').toDate();
        const tomorrow = (0, moment_1.default)().endOf('day').toDate();
        // Group by session and collect student data
        const attendanceData = yield Attendance_1.default.aggregate([
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
        const totalStudents = yield User_1.default.countDocuments({
            role: 'STUDENT',
            organizationId: req.organizationId,
        });
        // Restructure response
        const lectures = attendanceData.map((session) => ({
            date: session.date,
            studentsPresent: session.studentsPresent.filter(Boolean), // Remove nulls
        }));
        res.status(200).json({
            date: (0, moment_1.default)(today).format('YYYY-MM-DD'),
            totalStudents,
            lectures,
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
// Analytics for all dates
const getAllDatesAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attendanceData = yield Attendance_1.default.aggregate([
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
            studentsPresent: entry.sessions.map((session) => session.studentsPresent.filter(Boolean) // Remove nulls
            ),
        }));
        res.status(200).json({
            lectures,
        });
    }
    catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
exports.getAllDatesAnalytics = getAllDatesAnalytics;
