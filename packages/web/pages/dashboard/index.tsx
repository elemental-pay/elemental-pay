import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { Box, Text, Row, Button as _Button, Line } from 'elemental-react';
import { Button, Select } from '@elemental-zcash/components';
import InputField from '@elemental-zcash/components/lib/forms/InputField';
import TextInput from '@elemental-zcash/components/lib/forms/TextInput';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import GET_VIEWER from '../../graphql/queries/viewer';
import { Viewer, ViewerNotFoundError } from '../../hooks/use-viewer';

// import Section from '../components/Section';
// import VerifyEmailLoginBox from '../components/auth/verify-email-login-box';
// import SEND_VERIFICATION_EMAIL from '../graphql/mutations/send-verification-email';
// import { Link } from '../components/common';
import { TextButton } from '@elemental-zcash/components/lib/buttons';
import Layout from '../../components/Layout';
import Section from '../../components/common/Section';
import Link from '../../components/common/Link';
import client from '../../apollo-client';
import { Sidebar } from '../../components/nav/sidebar';
import { withAuth } from '../../components/hocs/with-auth';
// import RegisterForm from '../components/register/register-form';

const ChooseStore = ({
  stores = [{ label: 'Store A', value: '1' }, { label: 'Store B', value: '2' }, { label: 'Store C', value: '3' }],
  onChangeStore,
}) => {
  const options = [{ label: 'All Stores', value: 'all' }].concat(stores);
  const [selectedStore, setSelectedStore] = useState();

  return (
    <Select // @ts-ignore
      defaultValue={options[0]}
      options={options}
      // value={values.currency}
      value={options ? options.find(option => option.value === selectedStore) : ''}
      onChange={(option) => {
        setSelectedStore(option.value)
        onChangeStore(option.value)
      }}
    />
  )
}

export const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Stores', href: '/dashboard/stores' },
  { name: 'Choose Store', component: (
    <Box m={16} p={16} my={0}>
      <ChooseStore onChangeStore={() => {}} />
    </Box>
  )},
  {
    name: 'Payments',
    items: [
      { name: 'Invoices', href: '/dashboard/invoices' },
      { name: 'Point of Sale', href: '/dashboard/pos' },
    ]
  },
  {
    name: 'Integrations',
    items: [
      { name: 'API Tokens', href: '/dashboard/api-tokens' },
      { name: 'BTCPayServer', href: '/dashboard/btcpay' },
    ]
  }
];

export const makeNavItems = (onChangeStore) => [
  { name: 'Choose Store', component: (
    <Box m={16} p={16} my={0}>
      <ChooseStore onChangeStore={onChangeStore} />
    </Box>
  )},
  { name: 'Overview', href: '/dashboard' },
  { name: 'Stores', href: '/dashboard/stores' },
  {
    name: 'Payments',
    items: [
      { name: 'Invoices', href: '/dashboard/invoices' },
      { name: 'Point of Sale', href: '/dashboard/pos' },
    ]
  },
  {
    name: 'Integrations',
    items: [
      { name: 'API Tokens', href: '/dashboard/api-tokens' },
      { name: 'BTCPayServer', href: '/dashboard/btcpay' },
    ]
  }
];



export function Dashboard() {
  const { loading, data, error, client } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);
  // const [sendVerificationEmail, { data: verificationData, loading: verificationLoading, error: verificationError }] = useMutation<{ sendVerificationEmail: boolean }, { address: string }>(SEND_VERIFICATION_EMAIL);
  const apolloClient = useApolloClient();
  const onChangeStore = useCallback((id) => { console.log({ id }) }, []);

  // const navItems = useCallback(() => {
  //   return makeNavItems(onChangeStore)
  // }, [])
  const navItems = useMemo(() => {
    return makeNavItems(onChangeStore);
  }, [])


  return (
    <Box flex={1} justifyContent="center" alignItems="center" minHeight="100vh">
      <Head>
        <title>Elemental Pay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* <Sidebar navItems={navItems} /> */}
        <Section minHeight="75vh" alignItems="center">
          <Text fontSize={40} color="black" mb={32}>Dashboard</Text>
          <Row flex={1} flexWrap="wrap">
            <Link href="/stores">
              <Box bg="greys.2" borderRadius={12} width={300} height={300} m={16} alignItems="center" justifyContent="center">
                <Text fontSize={24} bold>Stores</Text>
              </Box>
            </Link>
            <Link href="/users" style={{ flex: 1 }}>
              <Box bg="greys.2" borderRadius={12} flex={1} m={16} alignItems="center" justifyContent="center">
                <Text fontSize={24} bold>Users</Text>
              </Box>
            </Link>
            <Link href="/account" style={{ flex: 1 }}>
              <Box bg="greys.2" borderRadius={12} width={300} height={300} m={16} alignItems="center" justifyContent="center">
                <Text fontSize={24} bold>Account</Text>
              </Box>
            </Link>
            <Box bg="greys.2" borderRadius={12} width={300} height={300} m={16}></Box>
            <Box bg="greys.2" borderRadius={12} width={400} height={300} m={16}></Box>
            <Box bg="greys.2" borderRadius={12} flex={1} height={300} m={16}></Box>
          </Row>
        </Section>
      </Layout>
    </Box>
  )
}

export default withAuth(Dashboard);

// export async function getServerSideProps() {
//     const { data } = await client.query({
//         query: GET_VIEWER,
//     });

//     if (data.viewer) {
//         return { props: { user: data.viewer }}
//     }

//     return { props: {}, redirect: { destination: '/auth/login', permanent: false } };
// }
