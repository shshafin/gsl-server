import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/appError';
import { User } from '../User/user.model';
import { TUserLogin } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import httpStatus from 'http-status';
import { PasswordHistory } from '../User/passwordHistory/passwordHistory.model';
import mongoose from 'mongoose';

// ------------------------------
// LOGIN SERVICE
// ------------------------------
const loginExistingUser = async (payload: TUserLogin) => {
  const user = await User.findOne({ username: payload.username }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid credentials.',
      'User not found with provided username.',
    );
  }

  const isMatched = await bcrypt.compare(payload.password, user.password);
  if (!isMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid credentials.',
      'Password did not match for user.',
    );
  }

  const jwtPayload = {
    _id: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken: accessToken,
  };
};

// ------------------------------
// CHANGE PASSWORD SERVICE
// ------------------------------
const changePasswordFromDB = async (
  user: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  const { _id } = user;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findById(_id).select('+password');
    if (!existingUser) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found.',
        'No user found with given ID.',
      );
    }

    const currentPasswordMatched = await bcrypt.compare(
      payload.currentPassword,
      existingUser.password,
    );

    if (!currentPasswordMatched) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Incorrect current password.',
        'User tried to change password with wrong current password.',
      );
    }

    // Password history check (last 2 or 3)
    const historyRecord = await PasswordHistory.findOne({ userId: _id });
    let history = historyRecord?.passwordHistory || [];

    history.unshift(existingUser.password);
    history = history.slice(0, 3);

    // Prevent reuse of recent passwords
    for (const oldHashed of history) {
      const reused = await bcrypt.compare(payload.newPassword, oldHashed);
      if (reused) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'New password must be different from previous passwords.',
          'User attempted to reuse a recently used password.',
        );
      }
    }

    // Update password history
    await PasswordHistory.findOneAndUpdate(
      { userId: _id },
      { userId: _id, passwordHistory: history },
      { upsert: true },
    );

    const hashedNewPassword = await bcrypt.hash(
      payload.newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { password: hashedNewPassword },
      { new: true },
    );

    await session.commitTransaction();
    session.endSession();

    return updatedUser;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Password change failed. Try again.',
      'Internal error during password change transaction.',
    );
  }
};

export const AuthServices = {
  loginExistingUser,
  changePasswordFromDB,
};
