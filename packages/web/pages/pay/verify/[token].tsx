import React from 'react';
import { Box, Text } from 'elemental-react';
import Formik from 'formik';
import { useRouter } from 'next/router';
import { InvoiceElement } from '@elemental-pay/components';

import Layout from '../../../components/Layout';
import Section from '../../../components/common/Section';
import { copyTextToClipboard } from '../../../utils/copy';
import Link from '../../../components/common/Link';
import { decodeMemo } from '../../../utils/zcash';
import { Button } from '@elemental-zcash/components';

const WalletButtonContainer = ({ href, children, ...props }) => (
  <a href={href} style={{ display: 'flex', flex: 1 }} {...props}>
    {children}
  </a>
)

const Token = ({ ...props }) => {
  const router = useRouter();
  const {
    token,
    businessName,
    currency,
    amount,
    address,
  } = router.query;

  return (
    <Layout>

      <Box alignItems="center" justifyContent="center">
        <Section width="100%" maxWidth={640} justifyContent="center" alignItems="center">
          <Text mt={40} fontSize={32} lineHeight={40} mb={24}>Token for Merchant Verification</Text>
          <Box alignItems="center" justifyContent="center" bg="greys.1" borderRadius={12} py={16} px={24}>
            <Text fontSize={16} fontFamily="IBM Plex Mono">{token}</Text>
          </Box>
          <Box mt={24}>
            <Link href={{
              pathname: '/pay/checkout',
              query: {
                businessName,
                currency,
                amount,
                address,
              }
            }}>
              <Button>
                Back to Checkout
              </Button>
            </Link>
          </Box>
        </Section>
      </Box>
    </Layout>
  );
};

export default Token;
