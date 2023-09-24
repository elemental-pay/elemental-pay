import { mergeTypeDefs } from '@graphql-tools/merge';

import interfaces from './interface.types';
import userType from './user.types';
import utilType from './util.types';
import oAuthType from './oauth.types';

const types = [
  interfaces,
  userType,
  utilType,
  oAuthType,
];

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
// @ts-ignore
export default mergeTypeDefs(types, { all: true });
