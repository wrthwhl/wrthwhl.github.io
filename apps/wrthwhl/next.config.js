// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const { withContentlayer } = require('next-contentlayer2');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  }
};

const plugins = [withNx, withContentlayer];

module.exports = composePlugins(...plugins)(nextConfig);
