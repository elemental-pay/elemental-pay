export default `
  scalar Date
  type User {
    id: ID!
    name: String!
    joinedOn: String
  }
  input UserInput {
    id: ID
    name: String
  }
  type Query {
    users: [User]
    user(id: ID!): User
    userByName(name: String!): User
  }
  type UserResponse implements Response {
    success: Boolean!
    message: String!
    code: String
    errorCode: String
    user: User
  }
  
  type DeleteResponse implements Response {
    success: Boolean!
    message: String!
    code: String
    errorCode: String
  }
  type Mutation {
    createUser(id: ID!, user: UserInput): UserResponse
    updateUser(id: ID!, user: UserInput): UserResponse
    deleteUser(id: ID!): DeleteResponse
  }
`