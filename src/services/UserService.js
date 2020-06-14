import { query } from '../db';
import ServiceError from '../util/ServiceError';

const get = async ({ id }) => {
  try {
    const getUserQuery = `
    SELECT * FROM user_detail
    WHERE user_id=$1;
    `;
    const params = [id];

    const { rows } = await query(getUserQuery, params);
    return rows[0];
  } catch (err) {
    console.log(err);
    throw new ServiceError({ message: 'Internal Service Error', status: 500 });
  }
};

export { get };
