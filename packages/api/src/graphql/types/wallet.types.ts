export default `
  type Wallet {
    name: String!
    description: String
    createdAt: Date
    currency: Currency!
    viewingKey: String!
    """
    balance: Float!
    transactions: [Transaction!]!
    """
  }
`;
