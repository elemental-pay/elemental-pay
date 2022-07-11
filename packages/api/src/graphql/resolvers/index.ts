import { mergeResolvers } from '@graphql-tools/merge';

import scalars from './scalars';

import userResolver from './user.resolver';
// const invoiceResolver = require('./invoice.resolver');

const resolvers = [
  scalars,
  userResolver,
  // invoiceResolver,
];

export default mergeResolvers(resolvers);
