import { query } from '../db';
import ServiceError from '../util/ServiceError';

/**
 * Create Order
 * @param {object} products
 * @returns {object} status
 */

const create = async ({ products, userId }) => {
  try {
    const insertOrderQuery = `
    INSERT INTO orders (user_id, order_detail) VALUES ($2, $1);
    `;
    await query(insertOrderQuery, [JSON.stringify(products), userId]);
    return true;
  } catch (error) {
    // throw error;
    console.log(error);
    throw new ServiceError({ message: 'Internal Service Error', status: false });
  }
};

export { create };
