import express from 'express';
// import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';

import { getRepository } from 'elemental-orm';
import { User } from './models';
import { db } from './db';

import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './graphql/types';
import resolvers from './graphql/resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


const app = express();

app.use(express.json());


app.use('/graphql', graphqlHTTP((req, res, graphQLParams) => ({
  context: {
    users: {// @ts-ignore
      ...db.users,// @ts-ignore
      ...db.users.objects,
    },
    // whatever else you want
  },
  schema,
  graphiql: true,
  // graphiql: process.env.NODE_ENV === 'development',
})));

app.get('/test', async (req, res) => {
  // res.status(200).send("Hello, World! API is running...");

  try {
  // @ts-ignore
  // console.log(db.users);
  // @ts-ignore
  const user = await db.users.objects.all();
  console.log({ user });

  return res.status(200).json({ user });
  } catch (err) {
    res.status(500);
    console.log(err);
  }
});

export default app;

