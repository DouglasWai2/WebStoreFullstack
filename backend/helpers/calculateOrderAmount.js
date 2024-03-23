function calculateOrderAmount(items) {
  return items
    .reduce((acc, item) => {
      return (
        acc +
        parseFloat(item.shipment.custom_price - item.shipment.discount) +
        parseFloat(
          item.products.reduce(
            (acc2, product) =>
              acc2 +
              (product.currentPrice -
                product.currentPrice * product.currentDiscount) *
                product.quantity,
            0
          )
        )
      );
    }, 0)
    .toFixed(2);
}

module.exports = { calculateOrderAmount };
