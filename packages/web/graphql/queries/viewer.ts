import { gql } from '@apollo/client';

const GET_VIEWER = gql`
  query viewer {
    viewer {
      __typename
      ...on Viewer {
        user {
          id
          username
          name
          unverifiedEmail
          isVerifiedEmail
          bio
          zcashaddress
          socials {
            youtube
            instagram
            twitter
            website
          }
        }
        userId
      }
      ...on ViewerNotFoundError {
        message
        code
      }
    }
  }
`
export default GET_VIEWER;
