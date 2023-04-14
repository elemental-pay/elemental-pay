import fetch from 'node-fetch';

function encodeCredentials(clientId, clientSecret) {
  const encoded = `${clientId}:${clientSecret}`;
  const buffer = Buffer.from(encoded, 'utf-8');
  return buffer.toString('base64');
}

type Config = { introspectionEndpoint: string, clientId: string, clientSecret: string, tokenEndpoint: string, authorizationEndpoint: string, loginEndpoint: string };

class OAuth2Client {
  config: Config
  constructor(config: Config) {
    this.config = config;
  }

  async introspect(token) {
    const url = `${this.config.introspectionEndpoint}`;

    const body = new URLSearchParams();
    body.set('token', token);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Basic ${encodeCredentials(this.config.clientId, this.config.clientSecret)}`,
      },
      body,
    });

    if (!response.ok) {
      console.log({ response });
      throw new Error('Introspection request failed');
    }

    const data = await response.json();
    console.log(JSON.stringify({ data }))

    if (!data.active) {
      throw new Error('Token is invalid');
    }

    return data;
  }

  async token(code, redirectUri) {
    const url = `${this.config.tokenEndpoint}`;

    const body = new URLSearchParams();
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('client_id', this.config.clientId);
    body.append('redirect_uri', redirectUri);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodeCredentials(process.env.OAUTH_API_CLIENT_ID, process.env.OAUTH_API_CLIENT_SECRET)}`,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description);
    }

    return await response.json();
  }

  async authorize(token, scope, clientId, redirectUri, confirm) {
    const state = Math.random().toString(36).substring(2);
    const url = `${this.config.authorizationEndpoint}`;

    const queryParams = new URLSearchParams();
    // client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`
    queryParams.append('response_type', 'code');
    queryParams.append('client_id', clientId);
    queryParams.append('redirect_uri', redirectUri);
    queryParams.append('state', state);
    queryParams.append('scope', scope);

    const body = new URLSearchParams();
    if (confirm) {
      body.append('confirm', 'True');
    }

    const response = await fetch(`${url}?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
        // 'Authorization': `Basic ${encodeCredentials(process.env.OAUTH_API_CLIENT_ID, process.env.OAUTH_API_CLIENT_SECRET)}`,
      },
      body: body.toString(),
      redirect: 'manual',
    });

    if (response.status === 302) {
      const _redirectUri = response.headers.get('Location');
      console.log(JSON.stringify({ _redirectUri, 'response.url': response.headers }));
      // const data = await response.json();
      // console.log(JSON.stringify({ data }))
      const urlSearchParams = new URLSearchParams(_redirectUri.split('?')[1]);
      const authorizationCode = urlSearchParams.get('code');
  
      return { code: authorizationCode, redirectUri: _redirectUri.split('?')[0] };
    } else {
      if (!response.ok) {
        const error = await response.json();
        console.log(JSON.stringify({ error }))
        throw new Error(error.message);
      }

      return {}
    }
  }

  async getAuthorize(token, scope, state, clientId, redirectUri) {
    const url = `${this.config.authorizationEndpoint}`;

    const queryParams = new URLSearchParams();

    queryParams.append('response_type', 'code');
    queryParams.append('client_id', clientId);
    queryParams.append('redirect_uri', redirectUri);
    queryParams.append('scope', scope);
    // queryParams.append('state', state);
    // console.log(`${url}?${queryParams.toString()}`)
    const response = await fetch(`${url}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
        // 'Authorization': `Basic ${encodeCredentials(process.env.OAUTH_API_CLIENT_ID, process.env.OAUTH_API_CLIENT_SECRET)}`,
      },
      // body: body.toString(),
    });

    if (!response.ok) {
      try {
        const error = await response.json();
        console.log(JSON.stringify(error))
      } catch(err) {}
      throw new Error('Authorize verify failed');
    }

    return await response.json();
  }

  async login(username, password) {
    const url = `${this.config.loginEndpoint}`;

    const body = new URLSearchParams();
    // body.set('grant_type', 'password');
    // body.set('client_id', process.env.OAUTH_API_CLIENT_ID)
    body.set('username', username);
    body.set('password', password);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Basic ${encodeCredentials(process.env.OAUTH_API_CLIENT_ID, process.env.OAUTH_API_CLIENT_SECRET)}`,
      },
      body,
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        console.log(JSON.stringify({ error: data }));
      } catch(err) {}
      throw new Error('Authorization code request failed');
    }

    const data = await response.json();

    if (!data.code) {
      throw new Error('Authorization code not found in response');
    }

    return data.code;
  }
  // async login(username, password) {
  //   const url = `${this.config.tokenEndpoint}`;

  //   const body = new URLSearchParams();
  //   body.set('grant_type', 'password');
  //   body.set('client_id', process.env.OAUTH_API_CLIENT_ID)
  //   body.set('username', username);
  //   body.set('password', password);

  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //       Authorization: `Basic ${encodeCredentials(process.env.OAUTH_API_CLIENT_ID, process.env.OAUTH_API_CLIENT_SECRET)}`,
  //     },
  //     body,
  //   });

  //   if (!response.ok) {
  //     console.log('Failed')
  //     throw new Error('Token request failed');
  //   }

  //   const data = await response.json();
  //   console.log(JSON.stringify({ data }));

  //   if (!data.access_token) {
  //     throw new Error('Access token not found in response');
  //   }

  //   return data.access_token;
  // }
}

export default OAuth2Client;
