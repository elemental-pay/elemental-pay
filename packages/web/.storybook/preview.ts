import type { Preview } from "@storybook/react";

import appWrapper from '../stories/decorators';

import '../styles/layout.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    appWrapper,
  ],
};

export default preview;
