import Head from 'next/head';
import { Box, Text, Row } from 'elemental-react';
import { Button } from '@elemental-zcash/components';
import InputField from '@elemental-zcash/components/lib/forms/InputField';
import TextInput from '@elemental-zcash/components/lib/forms/TextInput';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import GET_VIEWER from '../graphql/queries/viewer';
import { Viewer, ViewerNotFoundError } from '../hooks/use-viewer';

// import Section from '../components/Section';
// import VerifyEmailLoginBox from '../components/auth/verify-email-login-box';
// import SEND_VERIFICATION_EMAIL from '../graphql/mutations/send-verification-email';
// import { Link } from '../components/common';
import { TextButton } from '@elemental-zcash/components/lib/buttons';
// import RegisterForm from '../components/register/register-form';


export default function Home() {
  const { loading, data, error, client } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);
  // const [sendVerificationEmail, { data: verificationData, loading: verificationLoading, error: verificationError }] = useMutation<{ sendVerificationEmail: boolean }, { address: string }>(SEND_VERIFICATION_EMAIL);
  const apolloClient = useApolloClient();


  return (
    <Box flex={1} justifyContent="center" alignItems="center" minHeight="100vh">
      <Head>
        <title>Elemental Zcash SSO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Text>Hello, World!</Text>
      {/* <Section width="100%" maxWidth={640}>
        <Box mt={20} alignItems="center">
          {data?.viewer?.__typename === 'Viewer' && data?.viewer?.userId ? (
            <Box>
              {data.viewer.user.isVerifiedEmail ? (
                <>
                  <Text center mb={16}>You are logged in.</Text>
                  <Box mb={20}>
                    <Link href={`/settings/profile`}>
                      <TextButton m={0} color="blue">Go to Your Settings</TextButton>
                    </Link>
                  </Box>
                  <Box mb={20}>
                    <Link href={`/user/${data.viewer.user.id}`}>
                      <TextButton m={0} color="blue">Go to Your Public Profile</TextButton>
                    </Link>
                  </Box>
                  <Button onPress={() => {
                    localStorage.clear();
                    apolloClient.resetStore();
                  }}>LOG OUT</Button>
                </>
              ) : (
                <>
                  <VerifyEmailLoginBox email={data.viewer.user.unverifiedEmail} onPressResend={async () => {
                    const unverifiedEmail = (data?.viewer as Viewer)?.user?.unverifiedEmail;
                    if (unverifiedEmail) {
                      const { data: mutationData, errors } = await sendVerificationEmail({ variables: { address: unverifiedEmail }});

                    }
                  }} />
                  <Button onPress={() => {
                    localStorage.clear();
                    apolloClient.resetStore();
                  }}>LOG OUT</Button>
                </>
              )}
            </Box>
          ) : (
            <Box>
              <Link href="/auth/signup">
                <Button>SIGN UP</Button>
              </Link>
              <Row flex={1}>
                <Text style={{ display: 'inline' }}>
                  {'Already have an account? '}
                  <Link href="/auth/login">
                    <Text color="blue" style={{ display: 'inline' }}>Sign In</Text>
                  </Link>
                </Text>
              </Row>
            </Box>
          )}
        </Box>
      </Section> */}


      {/* <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer> */}
{/* @ts-ignore */}
      {/* <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .title a {
          color: #0070f3;
          text-decoration: none;
        }
        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
        .title,
        .description {
          text-align: center;
        }
        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }
        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }
        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }
        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
        .logo {
          height: 1em;
        }
        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style> */}
{/* @ts-ignore */}
      {/* <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style> */}
    </Box>
  )
}
