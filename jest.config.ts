import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
  };
};
