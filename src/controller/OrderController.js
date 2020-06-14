import { create as createOrder } from '../services/OrderService';
import { update as updateInventory } from '../services/InventoryService';
import ServiceError from '../util/ServiceError';

const create = async ({ userId, products }) => {
  try {
    // Create Order, after validating products and user
    // Check if inventory has sufficient stock. If yes, then update the inventory
    const isInventoryUpdated = await updateInventory({
      products,
    });
    if (!isInventoryUpdated) {
      throw new ServiceError({
        message: 'Few products have been sold out!, request cannot be processed',
        status: 400,
      });
    }
    await createOrder({
      products,
      userId,
    });
    return;
  } catch (err) {
    throw new Error(err);
  }
};

export { create };
