import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import Organization from '../models/Organization';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { config } from '../db/config';
import { sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import generateTextCode from '../utilities/textCodeGenerator';
import InviteCode from '../models/Invitecode';
import { sendEmail } from '../utilities/nodeMailer';
import inviteTemplate from '../utilities/email-templates/inviteTemplate';
import { AuthRequest } from '../middleware/auth';

// Define the signup schema
const signupSchema = z.object({
  firstName: z.string().max(20).min(2),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'ADMIN', 'SUPERADMIN']),
  profilePic: z.string(),
  phoneNumber: z.string().max(10),
  organizationName: z.string(),
  organizationId: z.string().optional(),
});

// Define the sign-in schema
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['STUDENT', 'TEACHER']),
  organizationId: z.string(),
  organizationName: z.string(),
  invitedBy: z.string().optional(),
  base_url_client: z.string(),
});

// Signup handler
const signup = async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    console.log(result);

    const { password, role, organizationName, ...rest } = result.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const existing = await User.findOne({ email: rest.email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let organizationId;

    // If role is admin or superadmin, create organization
    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      const adminOrganization = await Organization.create({
        name: organizationName,
        isActive: true,
      });
      organizationId = adminOrganization._id; // Store the organization ID
    } else {
      // For student role, ensure organizationId is provided
      if (!rest?.organizationId) {
        return res
          .status(400)
          .json({ message: 'OrganizationId is required for students.' });
      }
      organizationId = rest.organizationId;
    }

    // Create the user
    const newUser = await User.create({
      ...rest,
      password: hashedPassword,
      role,
      organizationId,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Sign-in handler
const signIn = async (req: Request, res: Response, next: NextFunction) => {
  // Validate the request data
  const result = signInSchema.safeParse(req.body);
  if (!result.success) {
    result.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    return next(createHttpError(400, 'Invalid request data'));
  }

  const { email, password } = result.data;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    // Verify password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(createHttpError(401, 'Username or password incorrect'));
    }

    // Generate JWT token
    const token = sign(
      { sub: user._id, role: user.role },
      config.jwtSecret as string,
      {
        expiresIn: '7d',
      }
    );

    console.log(token);

    // Respond with token
    return res
      .status(200)
      .json({ accessToken: token, message: 'User Login SuccessFully' });
  } catch (error) {
    console.error('Sign-in error:', error);
    return next(createHttpError(500, 'Error while signing in'));
  }
};

// invite user in organization

const inviteUser = async (req: Request, res: Response) => {
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

    const { email, role, organizationId, organizationName } = result.data;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the code
    const code = generateTextCode(8);

    // get invitedBy from jwt token in headers
    console.log('_req', (req as AuthRequest).userId);
    const invitedBy = (req as AuthRequest).userId;
    // const invitedBy = req.headers.authorization?.split(' ')[1];
    // console.log('invitedBy check=>', invitedBy);

    // using token to get user details

    // get invitedBy user details
    const invitedByUser = await User.findById(invitedBy);

    //invitedByUser undefined check
    if (!invitedByUser) {
      return res.status(404).json({ message: 'InvitedBy user not found' });
    }

    // Save the code
    await InviteCode.create({
      code,
      email,
      role,
      organizationId,
      organizationName,
      invitedBy,
    });

    const html_body: string = inviteTemplate({
      first_name: invitedByUser?.firstName,
      last_name: invitedByUser?.lastName,
      organization_name: organizationName,
      role,
      base_url_client: result.data.base_url_client,
      code,
      image_url: '', // Provide a valid image URL
      color: '#8928c6',
    });

    const data_to_send = {
      email,
      subject: `Invitation to join ${organizationName}`,
      html: html_body,
    };

    // Send the email
    await sendEmail(data_to_send);
  } catch (error) {
    console.error('Invite user error:', error);
  }
};

// verify code
const verifyCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const existing = await InviteCode.findOne({
      code,
    });

    if (!existing) {
      return res.status(404).json({ message: 'Code not found' });
    }

    return res.status(200).json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error('Verify code error:', error);
  }
};

export { signup, signIn, inviteUser, verifyCode };
