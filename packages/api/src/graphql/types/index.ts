import { mergeTypeDefs } from '@graphql-tools/merge';

import interfaces from './interfaces';
import userType from './user.type';
// const invoiceType = require('./invoice.type');

const types = [
  interfaces,
  userType,
  // invoiceType,
];

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
// export default mergeTypeDefs(types, { all: true });
export default mergeTypeDefs(types);
