import { writeFileSync, readFileSync } from 'fs';

export const writeToken = (token: string): void => {
  try {
    writeFileSync('token.txt', token, 'utf8');
  } catch (error) {
    console.log(error);
    // notify that operation was failed
  }
};

export const readToken = (): string => {
  return readFileSync('token.txt', 'utf8');
};
