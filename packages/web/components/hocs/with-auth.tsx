import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import GET_VIEWER from '../../graphql/queries/viewer';


export function withAuth(Component) {
  return function AuthComponent(props) {
    const router = useRouter();
    const { data, loading } = useQuery(GET_VIEWER);

    // FIXME: For testing, remove hardcoded value
    const isAuthenticated = true || data?.isAuthenticated;

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/auth/login');
      }
    }, [loading, data, router]);

    // if (loading) {
    //   return <div>Loading...</div>;
    // }

    return <Component loading={loading} {...props} />;
  };
}
