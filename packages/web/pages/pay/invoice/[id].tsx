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

const WalletButtonContainer = ({ href, children, ...props }) => (
  <a href={href} style={{ display: 'flex', flex: 1 }} {...props}>
    {children}
  </a>
)

const Invoice = ({ ...props }) => {
  const router = useRouter();
  const {
    id, zecAmount, zaddress, currency, memo, businessName,
  } = router.query;
  const decodedMemo = decodeMemo(memo);
  let _memo = { token: '' };
  try {
    _memo = typeof decodedMemo === 'string' ? JSON.parse(decodedMemo) : {};
  } catch(err) {}
  const { token } = _memo;

  return (
    <Layout>
      {/* <Section flex={1}>
        
        {JSON.stringify({ id, zecAmount, zaddress, currency, memo })}
      </Section> */}
      <Box alignItems="center" justifyContent="center">
        <Section width="100%" maxWidth={640} justifyContent="center" alignItems="center">
          <InvoiceElement
            currency="ZEC"
            amount={Number(zecAmount)}
            address={String(zaddress)}
            memo={String(memo)}
            onCopyPress={async () => {
              if (!zaddress) {
                return;
              }
              await copyTextToClipboard(`zcash:${zaddress}?amount=${zecAmount}&memo=${memo}`);
            }}
            // currency=
            components={{
              WalletButtonContainer: (props) => <WalletButtonContainer href={`zcash:${zaddress}?amount=${zecAmount}&memo=${memo}`} {...props} />
            }}
          />
          <Link href={{
            pathname: `/pay/verify/[token]`,
            query: {
              token,
              businessName,
              currency,
              amount: zecAmount,
              address: zaddress,
            }
          }}>
            <Box mt={40} py="16px" px={20} bg="#1D1D1D" alignItems="center" justifyContent="center">
              <Text color="#33FF00" fontWeight="bold" fontSize={16}>CLICK HERE WHEN SENT</Text>
            </Box>
          </Link>
        </Section>
      </Box>
    </Layout>
  );
};

export default Invoice;
