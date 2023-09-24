import { GraphQLContext } from '../../apollo';
// import init from '../../scripts/init-sql';

const resolver = {
  Mutation: {
    resetDatabase: async (_, { input }, context: GraphQLContext) => {
      try {
        if (!context?.viewer?.isSystem) {
          return { success: false, message: 'Auth failed' };
        }

        // await init();
        // TODO: Only allow in dev environment with auth

        return { success: true, message: 'Database reset.' };
      } catch (err) {
        throw err;
      }
    },
  }
}

export default resolver;
