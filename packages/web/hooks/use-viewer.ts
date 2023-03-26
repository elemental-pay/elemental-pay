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
  const { loading, data } = useQuery<{ viewer: Viewer | ViewerNotFoundError }>(GET_VIEWER);
  
  if (loading) {
    return { loading };
  }

  return data.viewer
};

export default useViewer;
