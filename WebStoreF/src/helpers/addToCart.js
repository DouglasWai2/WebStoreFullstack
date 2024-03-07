export function addToCart(product) {


  const newProduct = {
    productId: product._id,
    price: product.price,
    discount: product.discount,
    title: product.title,
    thumbnail: product.thumbnail,
    quantity: 1,
  };

  var cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
    return addToCart(product);
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

  cart.push(newProduct);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}
