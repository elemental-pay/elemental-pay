import { useQuery } from '@apollo/client';

import GET_VIEWER from '../graphql/queries/viewer';

interface User {
  id: string,
  name?: string,
  username?: string,
  email?: string,
  unverifiedEmail: string,
  isVerifiedEmail: boolean,
  bio?: string,
  zcashaddress?: string,
  socials?: {
    youtube: string,
    instagram: string,
    twitter: string,
    website: string,
  },
};

export interface Viewer {
  __typename: 'Viewer',
  user: User,
  userId: string,
};

export interface ViewerNotFoundError {
  __typename: 'ViewerNotFoundError',
  message: string,
  code: string,
};

const useViewer = () => {
  const { loading, data, error } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);
  
  if (loading) {
    return { loading, viewer: null };
  }
  if (error) {
    // FIXME: 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('tokenType');
    return { loading: false, error, viewer: null };
  }

  return { viewer: data.viewer, loading: false }
};

export default useViewer;
