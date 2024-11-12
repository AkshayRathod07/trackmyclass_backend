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
exports.getUsersInOrganization = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../models/User"));
const getUsersInOrganization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('reqorg', req);
        const { organizationId } = req;
        // Ensure the organizationId exists on the request
        if (!organizationId) {
            return next((0, http_errors_1.default)(400, 'Organization ID not found in the request'));
        }
        console.log(organizationId);
        // Fetch users belonging to the same organization
        const users = yield User_1.default.find({ organizationId: organizationId }); // Adjust to match your schema
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsersInOrganization = getUsersInOrganization;
