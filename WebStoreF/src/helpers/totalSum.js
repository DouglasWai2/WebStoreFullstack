export function calculateSubTotal(products) {
    return products.reduce((acc, { quantity, product }) => {
      return (
        acc + quantity * (product.price - product.price * product.discount)
      );
    }, 0);
  }

export function calculateShipment(items, shipment){
    return items.reduce((acc, i) => {
        if (!shipment[i]?.custom_price) return acc;
        return acc + parseFloat(shipment[i]?.custom_price - shipment[i]?.discount);
      }, 0);
}

export function calculateOrderAmount(items) {
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
  