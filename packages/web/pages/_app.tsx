import { AppProps } from 'next/app'
import React from 'react';
import { ThemeProvider, LayoutProvider } from 'elemental-react';
import { theme } from '@elemental-zcash/components';
import { RPNativeProvider } from '@react-platform/native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloProvider } from '@apollo/client';
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono, Roboto, Roboto_Mono } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
// const inter = Inter({ subsets: ['latin'] })
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] })
const robotoMono = Roboto_Mono({ subsets: ['latin'], weight: ['400', '700'] });

import useWindowViewport from '../components/hooks/use-window-viewport';
import apolloClient from '../apollo-client';

import '../styles/layout.css';



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
    light: ibmPlexSans.style.fontFamily,
    regular: ibmPlexSans.style.fontFamily,
    medium: ibmPlexSans.style.fontFamily,
    semiBold: ibmPlexSans.style.fontFamily,
    mono: ibmPlexMono.style.fontFamily,
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
    <>
      {/* <style jsx global>{`
        html {
          font-family: ${ibmPlexSans.style.fontFamily} ${ibmPlexSerif.style.fontFamily} ${ibmPlexMono.style.fontFamily} ${roboto.style.fontFamily};
        }
      `}</style> */}
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <RPNativeProvider processStyle={processStyleFunc}>
            <ThemeProvider
              design={{ Button: {} }}
              colorMode="day"
              // @ts-ignore
              theme={{
                ...theme,
                fonts: {
                  ...theme.fonts,
                  primary: typefaces.ibmPlexSans.mono,
                  primaries: typefaces.ibmPlexSans,
                  secondary: typefaces.ibmPlexSans.regular,
                  secondaries: typefaces.ibmPlexSans,
                  mono: typefaces.ibmPlexSans.mono,
                }
              }}
              >
              <Wrapper>
                <Component {...pageProps} />
              </Wrapper>
            </ThemeProvider>
          </RPNativeProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
