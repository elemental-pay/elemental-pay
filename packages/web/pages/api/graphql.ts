import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { getServerSession } from 'next-auth/next'

import { authOptions } from './auth/[...nextauth]'



import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';


const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const typeDefs = gql`
type Query {
    hello: String
}
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [ApolloServerPluginLandingPageDisabled()],
});

const getContextFromRequest = async (req, res) => {
    const user = await getServerSession(req, res, authOptions);
    return {};
}

export default startServerAndCreateNextHandler(server, {
    context: async (req, res) => getContextFromRequest(req, res),
  });