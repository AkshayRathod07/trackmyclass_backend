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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = exports.verifyCode = exports.inviteUser = exports.signIn = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const Organization_1 = __importDefault(require("../models/Organization"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../db/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const http_errors_1 = __importDefault(require("http-errors"));
const textCodeGenerator_1 = __importDefault(require("../utilities/textCodeGenerator"));
const Invitecode_1 = __importDefault(require("../models/Invitecode"));
const nodeMailer_1 = require("../utilities/nodeMailer");
const inviteTemplate_1 = __importDefault(require("../utilities/email-templates/inviteTemplate"));
// Define the signup schema
const signupSchema = zod_1.z.object({
    firstName: zod_1.z.string().max(20).min(2),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['STUDENT', 'ADMIN', 'TEACHER']),
    profilePic: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().max(10),
    organizationName: zod_1.z.string().refine((val) => val.length > 0, {
        message: 'Organization name is required',
    }),
    organizationId: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    location: zod_1.z
        .object({
        latitude: zod_1.z.number(),
        longitude: zod_1.z.number(),
    })
        .optional(),
});
// Define the sign-in schema
const signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const inviteUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['STUDENT', 'TEACHER']),
    invitedBy: zod_1.z.string().optional(),
    base_url_client: zod_1.z.string(),
});
// Signup handler
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            return res.status(400).json({ errors });
        }
        const _f = result.data, { password, role, organizationName } = _f, rest = __rest(_f, ["password", "role", "organizationName"]);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Check if user exists
        const existing = yield User_1.default.findOne({ email: rest.email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let organizationId;
        // If role is admin or superadmin, create organization
        if (role === 'ADMIN') {
            if (!((_a = result.data) === null || _a === void 0 ? void 0 : _a.address) || !((_b = result.data) === null || _b === void 0 ? void 0 : _b.location)) {
                return res
                    .status(400)
                    .json({ message: 'Address is required for organizations' });
            }
            const adminOrganization = yield Organization_1.default.create({
                name: organizationName,
                address: (_c = result.data) === null || _c === void 0 ? void 0 : _c.address,
                location: {
                    latitude: (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.location.latitude,
                    longitude: (_e = result === null || result === void 0 ? void 0 : result.data) === null || _e === void 0 ? void 0 : _e.location.latitude,
                },
                isActive: true,
            });
            organizationId = adminOrganization._id; // Store the organization ID
        }
        else {
            // For student role, ensure organizationId is provided
            if (!(rest === null || rest === void 0 ? void 0 : rest.organizationId)) {
                return res
                    .status(400)
                    .json({ message: 'OrganizationId is required for students.' });
            }
            organizationId = rest.organizationId;
        }
        // Create the user
        const newUser = yield User_1.default.create(Object.assign(Object.assign({}, rest), { password: hashedPassword, role,
            organizationId }));
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signup = signup;
// Sign-in handler
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the request data
    const result = signInSchema.safeParse(req.body);
    if (!result.success) {
        result.error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
        }));
        return next((0, http_errors_1.default)(400, 'Invalid request data'));
    }
    const { email, password } = result.data;
    try {
        // Find user by email
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return next((0, http_errors_1.default)(404, 'User not found'));
        }
        // Verify password
        const isMatched = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatched) {
            return next((0, http_errors_1.default)(401, 'Username or password incorrect'));
        }
        // Generate JWT token
        const token = (0, jsonwebtoken_1.sign)({ sub: user._id, role: user.role, organizationId: user.organizationId }, config_1.config.jwtSecret, {
            expiresIn: '7d',
        });
        // Respond with token
        return res
            .status(200)
            .json({ accessToken: token, message: 'User Login SuccessFully' });
    }
    catch (error) {
        console.error('Sign-in error:', error);
        return next((0, http_errors_1.default)(500, 'Error while signing in'));
    }
});
exports.signIn = signIn;
// invite user in organization
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = inviteUserSchema.safeParse(req.body);
        // handle validation errors
        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            return res.status(400).json({ errors });
        }
        const { email, role } = result.data;
        // Check if user exists
        const existing = yield User_1.default.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Check if an invite already exists for this email
        const existingInvite = yield Invitecode_1.default.findOne({ email });
        if (existingInvite) {
            return res
                .status(400)
                .json({ message: 'Invite already sent to this email' });
        }
        // Create the code
        const code = (0, textCodeGenerator_1.default)(8);
        // get invitedBy from jwt token in headers
        console.log('_req', req.userId);
        const invitedBy = req.userId;
        // const invitedBy = req.headers.authorization?.split(' ')[1];
        // console.log('invitedBy check=>', invitedBy);
        // using token to get user details
        // get invitedBy user details
        const invitedByUser = yield User_1.default.findById(invitedBy);
        //invitedByUser undefined check
        if (!invitedByUser) {
            return res.status(404).json({ message: 'InvitedBy user not found' });
        }
        // get organization details
        const organization = yield Organization_1.default.findById(req.organizationId);
        // organization undefined check
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        console.log();
        // Save the code
        yield Invitecode_1.default.create({
            code,
            email,
            role,
            organizationId: req.organizationId,
            organizationName: organization === null || organization === void 0 ? void 0 : organization.name,
            invitedBy,
        });
        const html_body = (0, inviteTemplate_1.default)({
            first_name: invitedByUser === null || invitedByUser === void 0 ? void 0 : invitedByUser.firstName,
            last_name: invitedByUser === null || invitedByUser === void 0 ? void 0 : invitedByUser.lastName,
            organization_name: organization.name,
            role,
            base_url_client: result.data.base_url_client,
            code,
            image_url: '', // Provide a valid image URL
            color: '#8928c6',
        });
        const data_to_send = {
            email,
            subject: `Invitation to join ${organization === null || organization === void 0 ? void 0 : organization.name}`,
            html: html_body,
        };
        // Send the email
        yield (0, nodeMailer_1.sendEmail)(data_to_send);
        return res.status(201).json({
            message: 'User invited',
            code,
        });
    }
    catch (error) {
        console.error('Invite user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.inviteUser = inviteUser;
// verify code
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        const existing = yield Invitecode_1.default.findOne({
            code,
        });
        if (!existing) {
            return res.status(404).json({ message: 'Code not found' });
        }
        return res.status(200).json({
            message: 'Code verified successfully',
            email: existing.email,
            role: existing.role,
            organizationName: existing.organizationName,
            organizationId: existing.organizationId,
        });
    }
    catch (error) {
        console.error('Verify code error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.verifyCode = verifyCode;
// get my profile
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req getMyProfile', req);
    try {
        const user = yield User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            user,
        });
    }
    catch (error) {
        console.error('Get my profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getMyProfile = getMyProfile;
