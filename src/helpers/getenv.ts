export const getEnv = (env: string): string => {
  const str = process.env[env];
  if (!str) {
    throw new Error(`variable: ${env} is undefined`);
  }

  return str;
};
