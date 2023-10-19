import path from 'path';
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config, options) => ({
    ...config,
    module: {
      ...config.module,
      rules: [// @ts-ignore
        ...config.module.rules
      ]
    },
    resolve: {
      ...config.resolve,
      alias: {// @ts-ignore
        ...(config.resolve.alias || {}),
        'react-native$': 'react-native-web',
        '@elemental-zcash/icons': path.resolve(__dirname, '../node_modules/@elemental-zcash/icons/'),
        // '@elemental-zcash/design': path.resolve(__dirname, '../node_modules/@elemental-zcash/design/'),
        '#components/*': path.resolve(__dirname, '../components/*'),
        '#components': path.resolve(__dirname, '../components/'),
          // '@elemental-zcash/components': path.resolve(__dirname, '../node_modules/@elemental-zcash/components/'),
        'react-select': path.resolve(__dirname, '../node_modules/react-select/'),
        '@elemental-pay/components': path.resolve(__dirname, '../node_modules/@elemental-pay/components'),
        'react-primitives': path.resolve(__dirname, '../node_modules/react-primitives/'),
        'react-primitives-svg': path.resolve(__dirname, '../node_modules/react-primitives-svg/'),
        'elemental-react': path.resolve(__dirname, '../node_modules/elemental-react/'),
        '@react-platform/svg': path.resolve(__dirname, '../node_modules/@react-platform/svg/'),
        '@react-platform/core': path.resolve(__dirname, '../node_modules/@react-platform/core/'),
        '@react-platform/native': path.resolve(__dirname, '../node_modules/@react-platform/native/'),
        '@material/material-color-utilities': path.resolve(__dirname, '../node_modules/@elemental-design/material-color-utilities/'),
      },
      extensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',// @ts-ignore
        ...config.resolve.extensions,
      ],
    }
  }),
};
export default config;
