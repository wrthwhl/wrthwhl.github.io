const nextEslintPluginNext = require('@next/eslint-plugin-next');
const baseConfig = require('../../eslint.config.js');

module.exports = [
  { plugins: { '@next/next': nextEslintPluginNext } },
  ...baseConfig,
  {
    ignores: ['.next/**/*'],
  },
];
