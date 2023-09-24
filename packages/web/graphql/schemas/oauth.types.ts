export default `
  input AuthCodeGrantInput {
    clientId: String!
    redirectUri: String
    scope: String!
  }

  type GrantRequest {
    scope: String
  }

  type OAuth2Client {
    clientId: String
    clientName: String
  }

  type AuthorizationGrantResponse {
    client: OAuth2Client
    request: GrantRequest
  }

  type AuthorizationCode {
    code: String
    redirectUri: String
  }

  type Query {
    checkAuthorizationGrant(input: AuthCodeGrantInput): AuthorizationGrantResponse
  }
  type Mutation {
    authorize(input: AuthCodeGrantInput!, confirm: Boolean!): AuthorizationCode!
  }
`;


