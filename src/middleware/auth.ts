import { config } from '../db/config';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { verify } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  role?: string; // Add role to the request interface
  organizationId?: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return next(createHttpError(401, 'Auth Token Required'));
  }

  try {
    const parsedToken = token.split(' ')[1];
    const decoded = verify(parsedToken, config.jwtSecret as string) as {
      sub: string;
      role: string;
      organizationId: string;
    };

    // check if organizationId exists
    if (!decoded.organizationId) {
      return next(
        createHttpError(400, 'Organization ID not found in the token')
      );
    }

    const _req = req as AuthRequest;
    _req.userId = decoded.sub;
    _req.role = decoded.role;
    _req.organizationId = decoded.organizationId;

    next();
  } catch (error) {
    return next(createHttpError(401, 'Token Expired or Invalid'));
  }
};

export const authTeacher = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== 'admin') {
    console.log(req.role);

    return next(
      createHttpError(403, 'Access Forbidden: Teacher role required')
    );
  }
  next();
};

export default auth;
