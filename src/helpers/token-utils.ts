import { writeFileSync, readFileSync } from 'fs';
import { NextFunction } from 'express';

export const writeToken = (token: string, fn: NextFunction): void => {
  try {
    writeFileSync('token.txt', token, 'utf8');
  } catch (error) {
    console.log(error);
    fn(error);
  }
};

export const readToken = (): string => {
  return readFileSync('token.txt', 'utf8');
};
