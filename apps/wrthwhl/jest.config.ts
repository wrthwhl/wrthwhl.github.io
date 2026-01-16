/* eslint-disable */
export default {
  displayName: 'wrthwhl',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(next-contentlayer2|contentlayer2)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/wrthwhl',
};
