import NextAuth from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';
import { OAuthConfig } from 'next-auth/providers';

import DataAdapter from '../../../lib/adapters/data.adapter';

type OAuthProfile = { sub: string, name?: string, email?: string, image?: string };

const ElementalSSOProvider = ({ oAuthUrl }): OAuthConfig<OAuthProfile> => ({
  id: 'elemental-sso',
  name: 'Elemental SSO',
  type: 'oauth',
  authorization: `https://${oAuthUrl}/oauth/authorize`,
  token: `https://${oAuthUrl}/oauth/token`,
  userinfo: `https://${oAuthUrl}/userinfo`,
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile?.name,
      email: profile?.email,
      image: profile?.image,
    }
  },
})

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),

    ElementalSSOProvider({
      oAuthUrl: process.env.SSO_OAUTH_URL,
    }),
    // ...add more providers here
  ],
  adapter: DataAdapter(),
  
}

export default NextAuth(authOptions)
