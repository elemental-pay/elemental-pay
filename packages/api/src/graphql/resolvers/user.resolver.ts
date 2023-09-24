// import { User } from '../../models';

import log from 'loglevel';
import { APIError, ErrorCodes } from '../utils';
import { GraphQLContext } from '../../apollo';

export default {
  User: {
    // invoice: async (parent) => {
    //   if (!parent.homePlotId) {
    //     return null;
    //   }
    //   const invoice = await Invoices.byId(parent.invoice);

    //   return invoice;
    // },
  },
  Query: {
    users: async (obj, args, context: GraphQLContext) => {
      const users = await context.users.all(context.viewer);
      console.log({ users });

      return users.map(({ users }) => users);
    },
    user: async (_, { id }, context: GraphQLContext) => {
      console.log({ id });
      const user = await context.users.findById(context.viewer, id);

      return user;
    },
    userByName: async (_, { name }, context) => {
      const [user] = await context.users.findById(name);

      return user;
    },
  },
  Mutation: {
    createUser: async (_, { id, user }, context) => {
      try {
        const { id: _, ...input } = user;
        // const { input } = body;
        const newUser = await context.users.create({ uuid: id, ...input });

        if (!newUser || newUser instanceof Error) {
          throw new APIError('Failed to create user', ErrorCodes.MISC_ERROR);
        }

        return {
          success: true,
          message: 'Success',
          user: newUser,
        };
      } catch (error) {
        console.log(error)
        throw new APIError('Error occurred', ErrorCodes.MISC_ERROR);
      }
    },
    updateUser: async (_, { id, user }, context) => {
      try {
        const updatedUserRes = await context.users.put(id, user);

        if (!updatedUserRes) {
            throw new APIError('Error occurred', ErrorCodes.MISC_ERROR);
        }

        const updatedUser = await context.users.byId(id);

        return {
          success: true,
          message: 'Success',
          user: updatedUser,
        };
      } catch (error) {
        console.log({ error });
        log.debug({ error })
        throw new APIError('Error occurred', ErrorCodes.MISC_ERROR);
      }
    },
    deleteUser: async (_, { id }, context) => {
      try {
        const success = await context.users.delete(id);
        if (!success) {
            throw new APIError('Error occurred', ErrorCodes.MISC_ERROR);
        }

        return {
          success: true,
          message: 'Success',
        };
      } catch (error) {
        log.debug({ error })
        throw new APIError('Error occurred', ErrorCodes.MISC_ERROR);
      }
    },
  },
};
