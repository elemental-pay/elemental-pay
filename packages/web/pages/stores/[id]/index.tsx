import Head from 'next/head';
import { Box, Text, Row, Button as _Button, Line } from 'elemental-react';
import { Button } from '@elemental-zcash/components';
import InputField from '@elemental-zcash/components/lib/forms/InputField';
import TextInput from '@elemental-zcash/components/lib/forms/TextInput';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import GET_VIEWER from '../../../graphql/queries/viewer';
import { Viewer, ViewerNotFoundError } from '../../../hooks/use-viewer';

// import Section from '../components/Section';
// import VerifyEmailLoginBox from '../components/auth/verify-email-login-box';
// import SEND_VERIFICATION_EMAIL from '../graphql/mutations/send-verification-email';
// import { Link } from '../components/common';
import { TextButton } from '@elemental-zcash/components/lib/buttons';
import Layout from '../../../components/Layout';
import Section from '../../../components/common/Section';
import Link from '../../../components/common/Link';
import { Sidebar } from '../../../components/nav/sidebar';
import { makeNavItems, navItems } from '../dashboard';
import { useMemo } from 'react';
import { useRouter } from 'next/router';


enum Status {
  LOADING = 'LOADING',
  EMPTY = 'EMPTY',
  FOUND = 'FOUND',
}

const StoreItem = ({ children = '', ...props }) => {
  return (
    <Box>{children}</Box>
  )
};

export default function Stores() {
  const { loading, data, error, client } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);
  const router = useRouter();

  const stores = [];
  const status = loading
    ? Status.LOADING
    : stores.length === 0
      ? Status.EMPTY
      : Status.FOUND;
  const navItems = useMemo(() => {
    return makeNavItems((id) => {
      if (id === 'all') {
        router.push('/stores')
      } else {
        router.push({
          pathname: `/stores/${id}`,
        });
      }
      console.log({ id })
    });
  }, []);


  return (
    <Box flex={1} justifyContent="center" alignItems="center" minHeight="100vh">
      <Head>
        <title>Elemental Pay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout showFooter={false} showLogo={false}>
        <Sidebar navItems={navItems} />
        <Section minHeight="75vh" alignItems="center" ml={[0, 256]}>
          <Row justifyContent="space-between">
            <Text fontSize={40} color="black" mb={32}>Stores</Text>
            <Link href="/dashboard/stores/create">
              <Button>Create Store</Button>
            </Link>
          </Row>
          {{
            [Status.LOADING]: (
              <Box alignItems="center" py={40}>
                <Text>
                  Loading...
                </Text>
              </Box>
            ),
            [Status.EMPTY]: (
              <Box alignItems="center" py={40}>
                <Text>No stores found, please create one.</Text>
              </Box>
            ),
            [Status.FOUND]: (
              <>
                {stores.map((store, i) => <StoreItem key={store.id || `index-${i}`} store={store} />)}
              </>
            )
          }[status]}
        </Section>
      </Layout>
    </Box>
  )
}