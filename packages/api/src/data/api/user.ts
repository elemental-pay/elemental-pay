import { UserType } from '../../models';
import { Viewer } from '../../types';
import APIWrapper from './base';

class UsersAPI {
  apiWrapper: APIWrapper;

  constructor(apiWrapper) {
    this.apiWrapper = apiWrapper;
  }

  async create(viewer, user) {
    const canCreate = checkCanCreate(viewer, user);
    if (!canCreate) {
      throw new Error('Not authorized to create users');
    }

    return this.apiWrapper.create('users', user);
  }

  async findById(viewer, userId) {
    const canRead = checkCanSee(viewer, { id: userId });
    if (!canRead) {
      throw new Error('Not authorized to read user');
    }

    return this.apiWrapper.get('users', userId);
  }

  async all(viewer) {
    const canRead = checkCanSeeAll(viewer);
    if (!canRead) {
      throw new Error('Not authorized to read user');
    }

    return this.apiWrapper.getAll(`users`);
  }

  async update(viewer, userId, user) {
    const canUpdate = checkCanUpdate(viewer, user);
    if (!canUpdate) {
      throw new Error('Not authorized to update user');
    }

    return this.apiWrapper.update('users', userId, user);
  }

  async delete(viewer, userId) {
    const canDelete = checkCanDelete(viewer, userId);
    if (!canDelete) {
      throw new Error('Not authorized to delete user');
    }

    return this.apiWrapper.delete('users', userId);
  }
}

// class UserAPI extends FlaskAPI {
//   async all(viewer: Viewer) {
//     const canSee = checkCanSeeAll(viewer);

//     if (!canSee) {
//       return null;
//     }

//     const users = await this.client('/api/users');

//     return users;
//   }

//   async create(viewer: Viewer, data: UserType): Promise<Partial<FormattedUserType> | null> {
//     const canCreate = checkCanCreate(viewer, data);
//     if (!canCreate) {
//       throw new Error('Not authorized to create users');
//     }

//     const newUser = await this.client('/api/users', 'POST', {
//       body: JSON.stringify(data),
//     });

//     return newUser;
//     // const res = await db.users.addUser(data);
//     // if (!res?.public_id) {
//     //   return null;
//     // }
//     // const userRes = await db.users.findById(res.public_id);
//     // // console.log({ res });
//     // const user = UserEntity.fromDb(userRes);

//     // if (!user) {
//     //   return null;
//     // }

//     // await cacheSaveEntity<User, FormattedUserType>((user.toRedisEntity as any), db.users.model, this.redisRepo);

//     // return user.toRes();
//   }
// }

const checkCanSee = (viewer: Viewer, user) => {
  // if (viewer.isAuthenticating) {
  //   return true;
  // }
  console.log({ viewerId: viewer.id, userId: user.id });
  return viewer.id === user.id;
}

const checkCanDelete = (viewer: Viewer, userId) => {
  // TODO:
  return true;
}

function checkCanSeeAll(viewer: Viewer) {
  return viewer.roles?.includes('admin');
}

const checkCanCreate = (viewer: Viewer, data: UserType) => {
  return !viewer.isAuthenticated;
  // return Boolean(viewer.isPublic && data.publicId);
}

const checkCanUpdate = (viewer: Viewer, data: UserType) => {
  // if (viewer.isAuthenticating) {
  //   return true;
  // }
  return viewer.id === data.publicId;
}

export default UsersAPI;
