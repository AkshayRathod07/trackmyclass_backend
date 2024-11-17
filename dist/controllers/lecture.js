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
exports.deleteLecture = exports.getLecture = exports.createLecture = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const Lecture_1 = __importDefault(require("../models/Lecture"));
const createLectureSchema = zod_1.z.object({
    startTime: zod_1.z.string().datetime({
        message: 'Invalid datetime string! Must be UTC.',
    }),
    endTime: zod_1.z.string().datetime({
        message: 'Invalid datetime string! Must be UTC.',
    }),
    subject: zod_1.z.string(),
    dayOfWeek: zod_1.z.string(),
    duration: zod_1.z.number().optional(),
});
const createLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = createLectureSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            return res.status(400).json({ errors });
        }
        const teacherId = req.userId;
        console.log('result:', result);
        // Check if the teacher exists
        const teacher = yield User_1.default.findById(teacherId);
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }
        // create a new lecture
        const newLecture = yield Lecture_1.default.create(Object.assign(Object.assign({}, result.data), { organizationId: req.organizationId }));
        return res.status(201).json({
            Success: true,
            message: 'Lecture created successfully',
            lectureId: newLecture._id,
            teacherId: teacherId,
        });
    }
    catch (error) {
        console.error('Create lecture error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating lecture',
        });
    }
});
exports.createLecture = createLecture;
// get lecture
const getLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.organizationId;
        console.log('organizationId:', organizationId);
        const lectures = yield Lecture_1.default.find({ organizationId });
        console.log('lectures:', lectures);
        return res.status(200).json({ lectures });
    }
    catch (error) {
        console.error('Get lecture error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching lectures',
        });
    }
});
exports.getLecture = getLecture;
// delete lecture
const deleteLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lectureId } = req.params;
        const lecture = yield Lecture_1.default.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }
        return res.status(200).json({ message: 'Lecture deleted successfully' });
    }
    catch (error) {
        console.error('Delete lecture error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting lecture',
        });
    }
});
exports.deleteLecture = deleteLecture;
