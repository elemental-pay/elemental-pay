import OAuth2Client from '../data/api/oauth2';


export const oAuthClient = new OAuth2Client({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  introspectionEndpoint: `${process.env.FLASK_API_URL}/oauth/introspect`,
  authorizationEndpoint: `${process.env.FLASK_API_URL}/oauth/authorize`,
  tokenEndpoint: `${process.env.FLASK_API_URL}/oauth/token`,
  loginEndpoint: `${process.env.FLASK_API_URL}/api/login`,
  // redirectUri: 'http://localhost:3000/auth/callback',
  // scope: 'openid profile email',
  // authorizationUri: 'https://your-auth-server.com/oauth2/authorize',
  // tokenUri: 'https://your-auth-server.com/oauth2/token',
  // userInfoUri: 'https://your-auth-server.com/oauth2/userinfo',
  // logoutUri: 'https://your-auth-server.com/logout',
});

export async function getUserFromAccessToken(accessToken) {
  // Send a request to the OAuth2 provider's introspection endpoint to verify the access token
  // const response = await axios.post('https://oauth2-provider.com/introspect', {
  //   token: accessToken,
  // });
  const data = await oAuthClient.introspect(accessToken);

  // console.log({ data });

  if (!data.active) {
    // The access token is not active or has been revoked
    throw new Error('Invalid access token');
  }

  // The access token is valid, so extract the user object from it
  // const user = data.user;
  const user = {
    id: data.sub,
    username: data.login_id,
    // ...
  };

  return user;
}
