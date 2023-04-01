import React, { FC } from 'react';
import { styled, Box, extend, Text, Row } from 'elemental-react';
import Link from '../common/Link';

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

};

const Nav: FC<Props> = () => {

  return (
    <NavContainer>{/* @ts-ignore */}
      <StyledNav>
        <NavContent>
          <Link href="/">
            <Text fontSize={24} bold flexShrink={0}>ELEMENTAL PAY</Text>
          </Link>
          <Row
            justifyContent="space-between"
            width="100%"
            display={['none', 'flex']}
            // display={{ base: "none", lg: "flex" }}
          >
            <LeftItems />
            <RightItems>
              <Box p={16}>
                <Text>LOGIN</Text>
              </Box>
              <Box p={16}>
                <Text>SIGNUP</Text>
              </Box>
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