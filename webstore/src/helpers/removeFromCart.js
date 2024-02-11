export function removeFromCart(productId) {
  let cart = JSON.parse(window.localStorage.getItem("cart"));
  const newCart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(newCart));
  window.dispatchEvent(new Event('storage'))
}
