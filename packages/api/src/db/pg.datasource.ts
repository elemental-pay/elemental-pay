import PgPromise, { IDatabase, IInitOptions, IMain } from 'pg-promise';
import { getRepository } from 'elemental-orm';

import { User } from '../models';

type Repository = any;

interface IExtensions {
  users: Repository,
  products: Repository,
}

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const initOptions: IInitOptions<IExtensions> = {
  capSQL: true,
  extend(obj: ExtendedProtocol, dc: any) {
      obj.users = getRepository(User, obj, pg)
      // obj.invoices = getRepository(Invoice, obj, pgp);
  }
};


const pg: IMain = PgPromise(initOptions);

const config = {
  host: 'localhost',
  port: 5432,
  database: 'elementalpay',
  user: 'elementalpay',
};

const db = pg(config);

export { db, pg };
