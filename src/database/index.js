import { Pool } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

let connectionString;

if (process.env.ENV_TEST) {
  connectionString = process.env.DATABASE_URL_TEST;
} else {
  connectionString = process.env.DATABASE_URL;
}

const pool = new Pool({ connectionString });
const baseUrl = process.env.BASE_URL;

winston.info(`Connected database: ${connectionString.replace(`${baseUrl}`, '')}`);

export default {
  query(text, values) {
    return new Promise((resolve, reject) => {
      pool.query(text, values)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
};
