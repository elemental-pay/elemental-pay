import { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider, LayoutProvider } from 'elemental-react';
import { theme } from '@elemental-zcash/components';
import { RPNativeProvider } from '@react-platform/native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloProvider } from '@apollo/client';


import useWindowViewport from '../components/hooks/use-window-viewport';
import apolloClient from '../apollo-client';

import '../styles/layout.css';

let WebFont;

try {
  WebFont = require('webfontloader');
} catch (err) {}

if (typeof window !== 'undefined' && WebFont) {
  WebFont.load({
    google: {
      families: ['IBM Plex Sans', 'IBM Plex Serif', 'IBM Plex Mono:300,400,500,700', 'Roboto', 'Roboto Mono']//'Roboto:300:400:500:700', 'Roboto Mono:300:400:500:700']
    },
  });
}

const queryClient = new QueryClient({});

const fontSizes = [96, 60, 48, 34, 24, 20, 16, 14];
const [h1, h2, h3, h4, h5, h6] = fontSizes;

const roundTo = function(target, num) {
  var resto = target % num;
  if (resto <= num / 2) {
    return target - resto;
  } else {
    return target + num - resto;
  }
};

const lineHeights = [h1, h2, h3, h4, h5, h6].map(n =>
  roundTo(Math.abs(n * 1.15), 4),
);
// @ts-ignore
fontSizes.h1 = h1;

const typefaces = {
  ibmPlexSans: {
    light: 'IBM Plex Sans',
    regular: 'IBM Plex Sans',
    medium: 'IBM Plex Sans',
    semiBold: 'IBM Plex Sans',
    mono: 'IBM Plex Mono'
  },
};


const getBreakpoint = (w) => {
  const width = Number(w);

  if (width <= 768) {
    return 0;
  }
  if (width <= 1024) {
    return 1;
  }

  return 2;
};

const Wrapper = ({ children }) => {
  const { width } = useWindowViewport();
  const breakpoint = getBreakpoint(width);

  return (
    <LayoutProvider breakpoint={breakpoint}>
      {children}
    </LayoutProvider>
  );
}

const processStyleFunc = (style) => ({ ...style });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <RPNativeProvider processStyle={processStyleFunc}>
          <ThemeProvider
            design={{ Button: {} }}
            // @ts-ignore
            colorMode="day"
            theme={{
              ...theme,
              // fonts: {
              //   ...theme.fonts,
              //   primary: typefaces.ibmPlexSans.mono,
              //   primaries: typefaces.ibmPlexSans,
              //   secondary: typefaces.ibmPlexSans.regular,
              //   secondaries: typefaces.ibmPlexSans,
              // }
            }}
            >
            <Wrapper>
              <Component {...pageProps} />
            </Wrapper>
          </ThemeProvider>
        </RPNativeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
};

export default App;
