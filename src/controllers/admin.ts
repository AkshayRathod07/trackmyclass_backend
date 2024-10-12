import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const userByOrganization = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as AuthRequest).organizationId;
    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID not found' });
    }

    const users = await User.find({
      organizationId,
    });
    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error('Get user by organization error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
