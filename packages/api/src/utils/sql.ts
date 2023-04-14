import { camelToSnakeCase } from 'elemental-orm/lib/utils/case';

export const jsonToSql = (obj: { [k: string]: unknown }) => Object.keys(obj).reduce((acc, k: string) => {
  acc[camelToSnakeCase(k)] = obj[k];

  return acc;
}, {});

export const parseResponse = res =>
Object.keys(res).reduce((acc, k) => {
  const value = res[k];

  if (k.includes('.')) {
    const [table, column] = k.split('.');

    if (!acc[table]) {
      acc[table] = {};
    }

    if (value) {
      if (value instanceof Date) {
        acc[table][column] = value.toISOString();
      } else {
        acc[table][column] = value;
      }
    }
  }


  return acc;
}, {});
