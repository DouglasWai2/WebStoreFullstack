export function addToCart(product) {
  
  var cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
    return addToCart(product);
  }

  const newProduct = {
    productId: product._id,
    price: product.price,
    discount: product.discount,
    title: product.title,
    thumbnail: product.thumbnail,
    quantity: 1,
  };

  if (
    cart.find((item, index) => {
      if (item.productId === product._id) {
        cart[index].quantity += 1;
        return true;
      }
      return false;
    })
  ) {
    localStorage.setItem("cart", JSON.stringify(cart));
    return window.dispatchEvent(new Event('storage'));
  }

  cart.push(newProduct);
  localStorage.setItem("cart", JSON.stringify(cart));
  return window.dispatchEvent(new Event('storage'));
}
