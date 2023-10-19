import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { QueryClientProvider } from 'react-query';
import { RPNativeProvider } from '@react-platform/native';
import { LayoutProvider, ThemeProvider } from 'elemental-react';
import { theme } from '@elemental-zcash/components';
// import { SessionProvider, useSession } from 'next-auth/react';

import { getBreakpoint, processStyleFunc, queryClient, typefaces } from '../pages/_app';
import useWindowViewport from '../components/hooks/use-window-viewport';


// import { useApollo } from '../apollo-client';
// import useWindowViewport from '../lib/hooks/use-window-viewport';

export const Wrapper = ({ children }) => {
  const { width } = useWindowViewport();
  const breakpoint = getBreakpoint(width);
  // const session = useSession()
  // const isLoggedIn = useIsLoggedIn();
  // if (session?.status === 'authenticated' && !isLoggedIn) {
  //   isLoggedInVar(true);
  // }

  return (
    <LayoutProvider breakpoint={breakpoint}>
      {children}
    </LayoutProvider>
  );
}

export const AppWrapper = ({ children, ...props }: any) => {
  // const session = useSession();
  return (
    <>
      {/* <style jsx global>{`
        html {
          font-family: ${ibmPlexSans.style.fontFamily} ${ibmPlexSerif.style.fontFamily} ${ibmPlexMono.style.fontFamily} ${roboto.style.fontFamily};
        }
      `}</style> */}
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
              {/* <SessionProvider session={session}> */}
                <Wrapper>
                  {/* <Component {...pageProps} /> */}
                  {children}
                </Wrapper>
              {/* </SessionProvider> */}
            </ThemeProvider>
          </RPNativeProvider>
        </QueryClientProvider>
    </>
  );
}

const appWrapper = (Story) => (// @ts-ignore
  <AppWrapper>
    <Story />
  </AppWrapper>
);

export default appWrapper;
