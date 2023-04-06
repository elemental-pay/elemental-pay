const getAppUrl = () => {
  const appEnvironment = process.env.APP_ENV;

  switch(appEnvironment) {
    case 'local': {
      return process.env.PUBLIC_APP_URL;
    }
    case 'staging': {
      return process.env.PUBLIC_APP_URL_STAGING;
    }
    case 'production': {
      return process.env.PUBLIC_APP_URL_PRODUCTION;
    }
    default: {
      throw new Error('No app environment found.');
    }
  }
}

export const APP_URL = getAppUrl();
