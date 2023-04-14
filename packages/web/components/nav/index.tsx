import React, { FC } from 'react';
import { styled, Box, extend, Text, Row } from 'elemental-react';
import Link from '../common/Link';
import { config } from '../../config';

// const NavContainer = styled(Box)`
//   position: sticky;
//   top: 0;
//   z-index: 99;
//   width: 100%;
// `;
const NavContainer = extend(Box, {
  position: 'sticky',
  top: '0px',
  zIndex: 99,
  width: '100%',
});

const StyledNav = extend(Box, {
  height: 64,
  py: 16,
  px: 16,
  justifyContent: 'center',
  bg: 'greys.1',
  as: 'nav'
});

// const HomeLogo = () =>

const NavContent = extend(Row, {
  width: '100%',
  // alignItems: ['center', 'initial'],
  alignItems: 'center',
  justifyContent: ['center', 'initial'],
});

const LeftItems = extend(Row, {
  flex: 1,
});

const RightItems = extend(Row, {
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
});

export interface Props {
  // clientId: string,
};

const Nav: FC<Props> = () => {

  const clientId = config.SSO_CLIENT_ID;

  return (
    <NavContainer>{/* @ts-ignore */}
      <StyledNav>
        <NavContent>
          <Link href="/">
            <a>
              <Text fontSize={24} bold flexShrink={0}>ELEMENTAL PAY</Text>
            </a>
          </Link>
          <Row
            justifyContent="space-between"
            width="100%"
            display={['none', 'flex']}
            // display={{ base: "none", lg: "flex" }}
          >
            <LeftItems />
            <RightItems>
              <Link
                // href={`http://elemental-sso.local/oauth/authorize?response_type=code&scope=profile&client_id=${clientId}&redirect_uri=https://elemental-pay.local/auth/callback`}
                href="/auth/login"
              >
                <a>
                  <Box p={16}>
                    <Text>LOGIN</Text>
                  </Box>
                </a>
              </Link>
              <Link
                // href="http://127.0.0.1:3000/auth/signup"
                // href={`http://elemental-sso.local/auth/signup?callback_uri=https://elemental-pay.local/auth/callback&scope=profile`}
                href="/auth/signup"
              >
                <a>
                  <Box p={16}>
                    <Text>SIGNUP</Text>
                  </Box>
                </a>
              </Link>
              {/* <Text>Menu</Text> */}
            </RightItems>
          </Row>
          {/* <MobileNavMenu
            isMenuOpen={isMenuOpen}
            isDarkTheme={isDarkTheme}
            toggleMenu={toggleMenu}
            toggleTheme={toggleColorMode}
            toggleSearch={toggleSearch}
            linkSections={mobileLinkSections}
            fromPageParameter={fromPageParameter}
          /> */}
        </NavContent>
      </StyledNav>
    </NavContainer>
  )
}

export default Nav;
