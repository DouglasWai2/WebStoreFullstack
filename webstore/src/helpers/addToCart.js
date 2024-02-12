export function addToCart(
  productId,
  price,
  discount,
  title,
  thumbnail,
  quantity
) {
  const product = {
    productId,
    price,
    discount,
    title,
    thumbnail,
    quantity: 1,
  };

  console.log(product)

  var cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
    return addToCart();
  }

  if (
    cart.find((item, index) => {
      if (item.productId === productId) {
        cart[index].quantity += 1;
        return true;
      }
      return false;
    })
  ) {
    return localStorage.setItem("cart", JSON.stringify(cart));
  }

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event('storage'))
}
