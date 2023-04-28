import { v4 as uuid } from 'uuid';

export const generateCode = () => {
  const code = uuid();
  return code.toUpperCase().split('-').shift();
};
