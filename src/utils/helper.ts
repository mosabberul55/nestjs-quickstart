import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { createHash } from 'crypto';

export const setRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const setRandomNumber = (length: number): string => {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
};

export const generateOTP = (length: number = 4): object => {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return {
    otp: result,
    validTill: new Date(Date.now() + 5 * 60 * 1000),
  };
};

export function validateObjectIdOrThrow(
  id: string,
  msg: string = 'Invalid Id',
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new NotFoundException(msg);
  }
}

export function hashItem(item: string): string {
  return createHash('sha256').update(item).digest('hex');
}
