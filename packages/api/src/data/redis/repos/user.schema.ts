import { Entity, Schema } from 'redis-om';

import { User } from '../../../models';
import { getRedisSchemaFromModel } from '../../../utils';

// class EmailConfirmationSchema extends Entity {}
// export const userEmailConfirmationSchema = new Schema(EmailConfirmationSchema, {
//   token: { type: 'text' },
//   expiresAt: { type: 'number' },
// });

export class UserEntity extends Entity {
  emailConfirmationToken: string;
  emailConfirmationExpiresAt: number;
  zcashaddressConfirmationToken: string;
  zcashaddressConfirmationExpiresAt: number;
  website: string;
  twitter: string;
  youtube: string;
  instagram: string;

  get emailConfirmation() {
    return {
      token: this.emailConfirmationToken,
      expiresAt: this.emailConfirmationExpiresAt,
    }
  }
  get zcashaddressConfirmation() {
    return {
      token: this.zcashaddressConfirmationToken,
      expiresAt: this.zcashaddressConfirmationExpiresAt,
    }
  }
  get socials() {
    return {
      website: this.website,
      twitter: this.twitter,
      youtube: this.youtube,
      instagram: this.instagram,
    }
  }
};

const { emailConfirmation, socials, ...schema } = getRedisSchemaFromModel(User);


export const userSchema = new Schema(UserEntity, {
  ...schema,
  'emailConfirmationToken': { type: 'string' },
  'emailConfirmationExpiresAt': { type: 'number' },
  'zcashaddressConfirmationToken': { type: 'string' },
  'zcashaddressConfirmationExpiresAt': { type: 'number' },
  'website': { type: 'string' },
  'twitter': { type: 'string' },
  'youtube': { type: 'string' },
  'instagram': { type: 'string' },
});

export default userSchema;
