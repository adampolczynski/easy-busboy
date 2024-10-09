import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  collectCoverageFrom: ['lib/*.{ts,tsx}'],
};

export default config;
