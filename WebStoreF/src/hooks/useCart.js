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
    var cart = localStorage.getItem("cart") || "[]";

    var parsedCart = JSON.parse(cart)

    console.log(parsedCart)

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
      parsedCart.find((item, index) => {
        if (item?.product._id === product._id) {
          parsedCart[index].quantity = parsedCart[index].quantity + quantity;
          return true;
        }
        return false;
      })
    ) {
      localStorage.setItem("cart", JSON.stringify(parsedCart));

      if (loggedIn)
        setBody({
          productId: product._id,
          quantity: quantity,
          action: "update",
        });

      return window.dispatchEvent(new Event("storage"));
    }

    parsedCart.push(newProduct);
    localStorage.setItem("cart", JSON.stringify(parsedCart));
    if (loggedIn) setBody({ productId: product._id, quantity: quantity, action: "add" });
    return window.dispatchEvent(new Event("storage"));
  }

  function removeFromCart(_id) {
    let cart = JSON.parse(window.localStorage.getItem("cart"));

    const newCart = cart.filter(item => ![..._id].includes(item.product._id));

    localStorage.setItem("cart", JSON.stringify(newCart));

    if (loggedIn) setBody({ productId: [..._id], action: "remove" });
    window.dispatchEvent(new Event("storage"));
  }

  return { addToCart, removeFromCart, syncCart, data, loading };
};
