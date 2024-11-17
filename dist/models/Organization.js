"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create schema for Organization
const organizationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        latitude: {
            type: Number,
            required: true,
            unique: true,
        },
        longitude: {
            type: Number,
            required: true,
            unique: true,
        },
    },
}, { timestamps: true });
const Organization = mongoose_1.default.model('Organization', organizationSchema);
exports.default = Organization;
