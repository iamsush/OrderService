import { getClient } from '../db';
import ServiceError from '../util/ServiceError';

/**
 * Create Order
 * @param {object} products
 * @returns {object} rows
 */

const update = async ({ products }) => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await getClient();

  try {
    // Begin a transaction to create an order
    await client.query('BEGIN');

    // Query Explanation:
    // It creates a sub query block for the product object (*Rows to be modified*),
    const PRODUCT_SUB_QUERY_BLOCK = `
    WITH modified_rows (product_id, qty, updated_timestamp) AS (
      SELECT *, now() as updated_timestamp
      FROM json_to_recordset($1)
      AS x(product_id int, qty int)
    )`;

    // Query Explanation:
    // Locks the rows to handle concurrency issue,
    // returns product which are eligible to purchase (*Inventory has enough stock to buy*)
    const lockProductsToUpdateQuery = `
    ${PRODUCT_SUB_QUERY_BLOCK}
    SELECT * FROM inventory i, modified_rows m 
    WHERE i.product_id = m.product_id and i.product_quantity >= m.qty FOR UPDATE;
    `;

    const params = [JSON.stringify(products)];

    const { rows: eligibleProducts } = await client.query(lockProductsToUpdateQuery, params);

    // If there is enough stock to purchase for each product, update the inventory
    if (products.length === eligibleProducts.length) {
      console.info('Updating Inventory ...');

      // Query Explanation:
      // Updates product in Inventory table
      const updateInventoryQuery = `
      ${PRODUCT_SUB_QUERY_BLOCK}
      UPDATE inventory i
      SET product_quantity = i.product_quantity - m.qty
      FROM modified_rows m
      WHERE i.product_id = m.product_id
      RETURNING *;
      `;
      const { rows: updatedProducts } = await client.query(updateInventoryQuery, params);
      console.log(updatedProducts);
      await client.query('COMMIT');
      return true;
    }
    await client.query('COMMIT');
    return false;
  } catch (error) {
    await client.query('ROLLBACK');
    // throw error;
    console.log(error);
    throw new ServiceError({ message: 'Internal Service Error', status: false });
  } finally {
    client.release();
  }
};

export { update };
