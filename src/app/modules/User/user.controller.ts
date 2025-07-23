import { RequestHandler, Request, Response } from 'express';
import { getSingleUserByEmail, UserServices } from './user.service';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.createUserIntoDB(req.body);
    const { _id, username, email, createdAt, updatedAt } = result;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id,
        username,
        email,
        createdAt,
        updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const FindSingleUser = async (req: Request, res: Response) => {
  const email = req.params.email;
  const result = await getSingleUserByEmail(email);
  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single User successfully',
    data: result,
  });
};

export const UserControllers = {
  createUser,
  FindSingleUser,
};
