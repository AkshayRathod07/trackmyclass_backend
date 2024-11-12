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
exports.createCollege = void 0;
const College_1 = __importDefault(require("../models/College"));
const zod_1 = require("zod");
const collegeSchema = zod_1.z.object({
    name: zod_1.z.string(),
    address: zod_1.z.object({
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        state: zod_1.z.string(),
        postalCode: zod_1.z.string(),
    }),
    location: zod_1.z.object({
        latitude: zod_1.z.number(),
        longitude: zod_1.z.number(),
    }),
});
const createCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request data
        const result = collegeSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            return res.status(400).json({ errors });
        }
        const { name, address, location } = result.data;
        // Create a new college instance
        const newCollege = new College_1.default({
            name,
            address,
            location,
        });
        // Save the college to the database
        const savedCollege = yield newCollege.save();
        // Respond with the created college
        res
            .status(201)
            .json({ message: 'College created successfully', college: savedCollege });
    }
    catch (error) {
        console.error('Error creating college:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createCollege = createCollege;
