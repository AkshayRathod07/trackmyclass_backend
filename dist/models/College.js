"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// College schema
const CollegeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true }, // College name must be unique
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    location: {
        latitude: { type: Number, required: true }, // Location (latitude)
        longitude: { type: Number, required: true }, // Location (longitude)
    },
});
// College model
const CollegeModel = (0, mongoose_1.model)('College', CollegeSchema);
exports.default = CollegeModel;
