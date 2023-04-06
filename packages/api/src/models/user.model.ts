import { models } from 'elemental-orm';

import { redisClient } from '../data';
import { makeRedisSave } from '../utils/redis';


class User extends models.Model {
  id = models.AutoField({ primary_key: true, redisType: 'string' });
  publicId = models.TextField();
  name = models.TextField();
  username = models.TextField();
  email = models.TextField();
  totp = models.JSONField();
  unverifiedEmail = models.TextField();
  isVerifiedEmail = models.BooleanField();
  pswd = models.TextField();
  joinedOn = models.DateTimeField();
  roles = models.TextArrayField();
  emailConfirmation = models.JSONField();
  zcashaddressConfirmation = models.JSONField();
  bio = models.TextField();
  socials = models.JSONField();
  zcashaddress = models.TextField();
  unverifiedZcashaddress = models.TextField();
  publicZcashaddress = models.TextField();
  passwordReset = models.JSONField();

  Meta = {
    db_table: 'users',
  }

  // data = {
  //   get: async (id: string) => {
  //     const cachedRes = await redisClient.hgetall(`${this.getTableName()}:${id}`);

  //     if (!cachedRes) {
  //       let objRes = await this.objects.get({ id });

  //       await makeRedisSave({ users: objRes.users });

  //       return { users: objRes.users };
  //     }

  //     return { users: cachedRes.users };
  //   }
  // }
}

// const user = new User({} as any, {} as any);
// export { user as User };

export default User;