module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!axios|react-scripts)',
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
};
