const path = require('path');
const withTM = require('next-transpile-modules')([
  '@elemental-zcash/components', '@elemental-pay/components', '@elemental-design/material-color-utilities', 'react-primitives-svg', 'elemental-react',
]);

module.exports = withTM({
  poweredByHeader: false,
  // env: {
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // },
  // pageExtensions: getBareExtensions(['web']),
  // pageExtensions: ['web', 'web.js', 'mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  webpack: (config) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules
      ]
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve.alias || {}),
        'react-native$': 'react-native-web',
        '@elemental-zcash/icons': path.resolve(__dirname, './node_modules/@elemental-zcash/icons/'),
        '@elemental-zcash/components': path.resolve(__dirname, './node_modules/@elemental-zcash/components/'),
        'react-select': path.resolve(__dirname, './node_modules/react-select/'),
        '@elemental-pay/components': path.resolve(__dirname, './node_modules/@elemental-pay/components'),
        'react-primitives': path.resolve(__dirname, './node_modules/react-primitives/'),
        'react-primitives-svg': path.resolve(__dirname, './node_modules/react-primitives-svg/'),
        'elemental-react': path.resolve(__dirname, './node_modules/elemental-react/'),
        '@react-platform/svg': path.resolve(__dirname, './node_modules/@react-platform/svg/'),
        '@react-platform/core': path.resolve(__dirname, './node_modules/@react-platform/core/'),
        '@react-platform/native': path.resolve(__dirname, './node_modules/@react-platform/native/'),
        '@material/material-color-utilities': path.resolve(__dirname, './node_modules/@elemental-design/material-color-utilities/'),
      },
      extensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',
        ...config.resolve.extensions,
      ],
    }
    // config.resolve.alias = {
    //   ...(config.resolve.alias || {}),
    //   // Transform all direct `react-native` imports to `react-native-web`
      
    // }
    // // config.resolve.extensions = [
    // //   '.web.js',
    // //   '.web.ts',
    // //   '.web.tsx',
    // //   ...config.resolve.extensions,
    // // ]
    // config.resolve.extensions = ['.web.js'].concat(config.resolve.extensions);
    // return config
  }),
});
