import createHttpError from 'http-errors';
import User from '../models/User';
import { AuthRequest } from './auth';
import { NextFunction, Request, Response } from 'express';

export const getUsersInOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('reqorg', req);

    const { organizationId } = req;

    // Ensure the organizationId exists on the request
    if (!organizationId) {
      return next(
        createHttpError(400, 'Organization ID not found in the request')
      );
    }
    console.log(organizationId);

    // Fetch users belonging to the same organization
    const users = await User.find({ organizationId: organizationId }); // Adjust to match your schema

    res.json(users);
  } catch (error) {
    next(error);
  }
};
