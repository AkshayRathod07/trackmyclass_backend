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
exports.deactivateSession = exports.deleteSession = exports.getAllSessions = exports.CreateSession = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const Lecture_1 = __importDefault(require("../models/Lecture"));
const Sessions_1 = __importDefault(require("../models/Sessions"));
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
const createSessionSchema = zod_1.z.object({
    teacherId: zod_1.z.string(),
    lectureId: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
});
const CreateSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
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
        const teacher = yield User_1.default.findById((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.teacherId);
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }
        // Check if the lecture exists
        const lecture = yield Lecture_1.default.findById((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.lectureId);
        if (!lecture) {
            return res.status(400).json({ message: 'Lecture not found' });
        }
        // Create a new session
        const newSession = yield Sessions_1.default.create(Object.assign(Object.assign({}, result.data), { isActive: true }));
        yield Lecture_1.default.findByIdAndUpdate((_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.lectureId, {
            $push: { sessionId: newSession._id },
        });
        // Schedule deactivation after 4 minutes (240,000 milliseconds)
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Trying to mark session ${newSession._id} inactive...`);
            try {
                yield Sessions_1.default.findByIdAndUpdate(newSession._id, { isActive: false });
                console.log(`Session ${newSession._id} is now inactive.`);
            }
            catch (error) {
                console.error(`Error updating session ${newSession._id} to inactive:`, error);
            }
        }), 240000); // 240000 milliseconds = 4 minutes
        // disabled the bull queue for now
        // Add a job to the Bull queue to deactivate the session in 4 minutes (240,000ms)
        // sessionQueue.add({ sessionId: newSession._id }, { delay: 240000 });
        return res.status(201).json({
            Success: true,
            newSession,
            message: 'Session created successfully',
            sessionId: newSession._id,
        });
    }
    catch (error) {
        console.error('Create session error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating session',
        });
    }
});
exports.CreateSession = CreateSession;
// deactivating session
const deactivateSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const session = yield Sessions_1.default.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        yield Sessions_1.default.findByIdAndUpdate(sessionId, { isActive: false });
        return res
            .status(200)
            .json({ message: 'Session deactivated successfully' });
    }
    catch (error) {
        console.error('Deactivate session error:', error);
        return res.status(500).json({
            message: 'An error occurred while deactivating session',
        });
    }
});
exports.deactivateSession = deactivateSession;
// get all sessions
const getAllSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('started get all sessions api call');
    try {
        const sessions = yield Sessions_1.default.find({
            isActive: true,
        });
        return res.status(200).json({ sessions });
    }
    catch (error) {
        console.error('Get all sessions error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching sessions',
        });
    }
});
exports.getAllSessions = getAllSessions;
// delete session
const deleteSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const session = yield Sessions_1.default.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        yield Sessions_1.default.findByIdAndDelete(sessionId);
        return res.status(200).json({ message: 'Session deleted successfully' });
    }
    catch (error) {
        console.error('Delete session error:', error);
        return res.status(500).json({
            message: 'An error occurred while deleting session',
        });
    }
});
exports.deleteSession = deleteSession;
