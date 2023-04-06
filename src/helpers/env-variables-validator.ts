export const validateEnvVar = (envVar: string): string => {
  const variable = process.env[envVar];
  if (variable === undefined) {
    throw new Error(`process.env.${envVar} is undefined!`);
  }
  return variable;
};
