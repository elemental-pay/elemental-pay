import Head from 'next/head';
import { Box, Text, Row, Button as _Button } from 'elemental-react';
import { Button } from '@elemental-zcash/components';
import InputField from '@elemental-zcash/components/lib/forms/InputField';
import TextInput from '@elemental-zcash/components/lib/forms/TextInput';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
// import GET_VIEWER from '../graphql/queries/viewer';
import { Viewer, ViewerNotFoundError } from '../../hooks/use-viewer';

// import Section from '../components/Section';
// import VerifyEmailLoginBox from '../components/auth/verify-email-login-box';
// import SEND_VERIFICATION_EMAIL from '../graphql/mutations/send-verification-email';
// import { Link } from '../components/common';
import { TextButton } from '@elemental-zcash/components/lib/buttons';
import Layout from '../../components/Layout';
import Section from '../../components/common/Section';
import Link from '../../components/common/Link';
import GET_VIEWER from '../../graphql/queries/viewer';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// import RegisterForm from '../components/register/register-form';


export default function AuthCallback() {
  const { loading, data, error, client } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);
  const router = useRouter();
  // const [sendVerificationEmail, { data: verificationData, loading: verificationLoading, error: verificationError }] = useMutation<{ sendVerificationEmail: boolean }, { address: string }>(SEND_VERIFICATION_EMAIL);
  // const apolloClient = useApolloClient();
  useEffect(() => {
    const { code } = router.query;

    if (code) {
      console.log({ code });
    }
  }, [router.query?.code]);


  return null;
  // return (
  //   <Box flex={1} justifyContent="center" alignItems="center" minHeight="100vh">
  //     <Head>
  //       <title>Elemental Pay</title>
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

  //     <Layout>
  //       <Section minHeight="75vh" justifyContent="center" alignItems="center" bg="black">
  //         <Text fontSize={40} color="white" mb={32}>Elemental Pay</Text>
  //         {/* <Row>
  //           <Box>
  //             <Text fontFamily="IBM Plex Sans" color="white" fontSize={32} lineHeight={40} mb={20}>Accept Crypto Payments</Text>
  //             <Text fontFamily="IBM Plex Sans" color="white" fontSize={20} lineHeight={24} mb={16}>Accept crypto payments online on your own website, in person or by email.</Text>
  //             {['Non custodial – bring your own wallet.', 'Private – accept Zcash', 'Simple'].map((txt, i) => (
  //               <Text key={i} fontFamily="IBM Plex Sans" color="white" fontSize={20} mb="12px">{`- ${txt}`}</Text>
  //             ))}
  //             <Link href="/pay/checkout">
  //               <Button minWidth={156} mt={20} height={52} style={{ cursor: 'pointer' }}>
  //                 <_Button.Text fontWeight="bold" color="#003796">START DEMO</_Button.Text>
  //               </Button>
  //             </Link>
  //           </Box>
  //           <Box width="40%" />
  //         </Row> */}
  //       </Section>
  //     </Layout>
  //   </Box>
  // )
};
