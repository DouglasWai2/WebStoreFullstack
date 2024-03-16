import { useEffect, useState } from "react";
import { useFetchApi } from "./useFetchApi";

export const useCart = (loggedIn) => {
  const [body, setBody] = useState(null);
  const { data, loading, error } = useFetchApi("/user/cart", "POST", body);

  function syncCart() {
    var cart = JSON.parse(localStorage.getItem("cart"));
    var products;
    if (cart?.length > 0) {
      products = cart.map((item) => {
        return { product: item.product._id, quantity: item.quantity };
      });
    }

    if (loggedIn)
      setBody({
        products,
        action: "sync",
      });


    return { data, loading, error };
  }

  useEffect(() => {
    if (data?.message === "Cart synced successfully") {
      const { cart } = data;
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }
  }, [data]);

  function addToCart(product) {
    var quantity = 1;
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      localStorage.setItem("cart", JSON.stringify([]));
      return addToCart(product);
    }

    const newProduct = {
      product: {
        _id: product._id,
        price: product.price,
        discount: product.discount,
        title: product.title,
        thumbnail: product.thumbnail,
      },
      quantity: quantity,
    };

    if (
      cart.find((item, index) => {
        if (item?.product._id === product._id) {
          quantity = cart[index].quantity + quantity;
          cart[index].quantity = quantity;
          return true;
        }
        return false;
      })
    ) {
      localStorage.setItem("cart", JSON.stringify(cart));

      if (loggedIn)
        setBody({
          productId: product._id,
          quantity: quantity,
          action: "update",
        });

      return window.dispatchEvent(new Event("storage"));
    }

    cart.push(newProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
    if (loggedIn)
      setBody({ productId: product._id, quantity: quantity, action: "add" });
    return window.dispatchEvent(new Event("storage"));
  }

  function removeFromCart(_id) {
    let cart = JSON.parse(window.localStorage.getItem("cart"));

    const newCart = cart.filter((item) => item?.product._id !== _id);

    localStorage.setItem("cart", JSON.stringify(newCart));

    if (loggedIn) setBody({ productId: _id, action: "remove" });
    window.dispatchEvent(new Event("storage"));
  }

  return { addToCart, removeFromCart, syncCart };
};
