import Head from 'next/head';
import { Box, Text, Row, Button as _Button, Line } from 'elemental-react';
import { Button } from '@elemental-zcash/components';
import InputField from '@elemental-zcash/components/lib/forms/InputField';
import TextInput from '@elemental-zcash/components/lib/forms/TextInput';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import GET_VIEWER from '../../../../graphql/queries/viewer';
import { Viewer, ViewerNotFoundError } from '../../../../hooks/use-viewer';

// import Section from '../components/Section';
// import VerifyEmailLoginBox from '../components/auth/verify-email-login-box';
// import SEND_VERIFICATION_EMAIL from '../graphql/mutations/send-verification-email';
// import { Link } from '../components/common';
import { TextButton } from '@elemental-zcash/components/lib/buttons';
import Layout from '../../../../components/Layout';
import Section from '../../../../components/common/Section';
import Link from '../../../../components/common/Link';
import { Sidebar } from '../../../../components/nav/sidebar';
import { navItems } from '../..';
import { Formik } from 'formik';


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

export default function CreateInvoice() {
  const { loading, data, error, client } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);

  const stores = [];
  const status = loading
    ? Status.LOADING
    : stores.length === 0
      ? Status.EMPTY
      : Status.FOUND;


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
            <Text fontSize={40} color="black" mb={32}>Create Invoice</Text>
            {/* <Link href="/dashboard/stores/create">
              <Button>Create Store</Button>
            </Link> */}
            <Formik
              initialValues={{}}
              onSubmit={() => {}}
            >
              {({ }) => (
                <>

                </>
              )}
            </Formik>
          </Row>
          
        </Section>
      </Layout>
    </Box>
  )
}