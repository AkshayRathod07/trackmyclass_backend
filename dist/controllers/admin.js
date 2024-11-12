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
exports.userByOrganization = void 0;
const User_1 = __importDefault(require("../models/User"));
const userByOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.organizationId;
        if (!organizationId) {
            return res.status(400).json({ message: 'Organization ID not found' });
        }
        const users = yield User_1.default.find({
            organizationId,
        });
        return res.status(200).json({
            users,
        });
    }
    catch (error) {
        console.error('Get user by organization error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.userByOrganization = userByOrganization;
