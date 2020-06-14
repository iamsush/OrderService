const validateProducts = async (products) => {
  return new Promise((resolve) => {
    if (!Array.isArray(products)) resolve(false);
    const properties = ['product_id', 'qty'];
    products.forEach((product) => {
      properties.forEach((property) => {
        if (!Object.prototype.hasOwnProperty.call(product, property)) resolve(false);
      });
    });
    resolve(true);
  });
};

export { validateProducts };
