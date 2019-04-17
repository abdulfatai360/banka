import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const conninfo = {
  development: {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    database: (process.env.ENV_TEST) ? process.env.PG_DATABASE_TEST : process.env.PG_DATABASE,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || null,
  },
  heroku: {
    connectionString: process.env.CONNECTION_URI,
    ssl: true,
  },
};

const env = (process.env.ENV === 'heroku') ? 'heroku' : 'development';
const pool = new Pool(conninfo[env]);

console.log('Current database: ', conninfo[env].database);

export default {
  query(text, values) {
    return new Promise((resolve, reject) => {
      pool.query(text, values)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
};
