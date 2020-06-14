import { Pool } from 'pg';
import accessEnv from '../util/accessEnv';

const pool = new Pool({
  user: accessEnv('DB_USER'),
  password: accessEnv('DB_PASSWORD'),
  host: accessEnv('DB_HOST'),
  port: accessEnv('DB_PORT'),
  database: accessEnv('DB_NAME'),
});

/**
 * DB Query
 * @param {object} text
 * @param {object} params
 * @returns {object} result object
 */
const query = async (text, params) => {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);

    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: result.rowCount });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { query, getClient };
