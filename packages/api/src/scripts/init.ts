/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { getRepository } from 'elemental-orm';

import { db } from '../db';

import { reset, users } from '../db/sql';


import User from '../models/user.model';



const init = async () => {
  try {
    await db.tx(async (t) => {
      await t.none(reset);
      await t.none(users.create);
      // await t.none(tokens.create);
      // await t.none(authorization.create);
      // await t.none(oauthClients.create);
    });


    // success;
    console.log('Success!');
  } catch (error) {
    console.log('ERROR:', error);
  }
};

init();
// export default init;
