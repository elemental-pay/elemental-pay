// import { User } from '../../models';

import { makeError } from '../utils';

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
    users: async (obj, args, context) => {
      const users = await context.users.all();
      console.log({ users });

      return users.map(({ users }) => users);
    },
    user: async (_, { id }, context) => {
      console.log({ id });
      const user = await context.users.byId(id);

      return user;
    },
    userByName: async (_, { name }, context) => {
      const [user] = await context.users.byId(name);

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
          return makeError();
        }

        return {
          success: true,
          message: 'Success',
          user: newUser,
        };
      } catch (error) {
        console.log(error)
        return makeError({ error });
      }
    },
    updateUser: async (_, { id, user }, context) => {
      try {
        const updatedUserRes = await context.users.put(id, user);

        if (!updatedUserRes) {
          return makeError();
        }

        const updatedUser = await context.users.byId(id);

        return {
          success: true,
          message: 'Success',
          user: updatedUser,
        };
      } catch (error) {
        console.log({ error });
        return makeError({ error });
      }
    },
    deleteUser: async (_, { id }, context) => {
      try {
        const success = await context.users.delete(id);
        if (!success) {
          return makeError();
        }

        return {
          success: true,
          message: 'Success',
        };
      } catch (error) {
        return makeError({ error });
      }
    },
  },
};
