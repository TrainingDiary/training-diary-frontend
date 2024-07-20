export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-transformer-svg',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    'src/(.*)$': '<rootDir>/src/$1',
    '^@icons/(.*)$': '<rootDir>/src/assets/icons/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
