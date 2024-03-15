import { useState } from "react";
import { useFetchApi } from "./useFetchApi";

export const useCart = () => {
  const [body, setBody] = useState(null);
  useFetchApi("/user/cart", "POST", body);

  function addToCart(product) {
    var quantity = 1;
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
      quantity: quantity,
    };

    if (
      cart.find((item, index) => {
        if (item.productId === product._id) {
          quantity = cart[index].quantity + quantity ;
          cart[index].quantity = quantity;
          return true;
        }
        return false;
      })
    ) {
      localStorage.setItem("cart", JSON.stringify(cart));
      setBody({ productId: product._id, quantity: quantity, action: "update" });
      return window.dispatchEvent(new Event("storage"));
    }

    cart.push(newProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
    setBody({ productId: product._id, quantity: quantity, action: "add" });
    return window.dispatchEvent(new Event("storage"));
  }

  function removeFromCart(productId) {
    let cart = JSON.parse(window.localStorage.getItem("cart"));
    const newCart = cart.filter((item) => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setBody({ productId: productId, action: "remove" });
    window.dispatchEvent(new Event("storage"));
  }

  return { addToCart, removeFromCart };
};
