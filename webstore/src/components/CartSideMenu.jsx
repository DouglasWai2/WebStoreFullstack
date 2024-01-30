import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { moneyMask } from "../helpers/moneyMask";
import { removeFromCart } from "../helpers/removeFromCart";
import Delayed from "./Delayed";

const CartSideMenu = ({ setCart }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(JSON.parse(window.localStorage.getItem("cart")));
  }, []);

  return (
    <aside className="fixed bg-white shadow-md right-0 top-0 w-[600px] h-screen animate-appear py-8 px-3 z-30">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="font-semibold text-xl text-slate-900">
            <FontAwesomeIcon icon={faCartShopping} className="mr-3" />
            Carrinho
          </p>
          <button
            className="text-lg font-semibold"
            onClick={() => {
              setCart(false);
            }}
          >
            X
          </button>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-5 mt-6">
          <Delayed>
            {cartItems.length ? (
              cartItems.map((item, index) => {
                return (
                  <div
                    className="border-2 flex items-center justify-between border-slate-200 rounded-md px-4 py-3 hover:border-slate-900 animate-appear"
                    key={item.id + index}
                  >
                    <div className="flex items-center">
                      <div className="w-[80px] object-contain mr-4">
                        <img
                          alt="product thumbnail"
                          className="w-full"
                          src={item.thumbnail}
                        />
                      </div>
                      <div className="w-full">
                        <p>{item.title}</p>
                        <p>Quantidade: {item.quantity}</p>

                        {item.discount > 0 && (
                          <p>
                            <span className="text-[#188fa7]">
                              {item.discount * 100}% OFF
                            </span>
                            <span className="strikethrough w-min h-min ml-2 text-gray-500 text-sm">
                              {item.price}
                            </span>
                          </p>
                        )}
                        <p>
                          Preço:{" "}
                          {moneyMask(
                            Number(
                              item.price - item.discount * item.price
                            ).toFixed(2)
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId);
                        setCartItems(
                          JSON.parse(window.localStorage.getItem("cart"))
                        );
                      }}
                      className="bg-slate-200 p-2 h-[50px] px-6 rounded-md text-red-500  hover:bg-red-500 hover:text-white duration-100"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-3xl text-center py-2">
                Adicione produtos ao carrinho
              </p>
            )}
          </Delayed>
        </div>
      </div>
      <div></div>
    </aside>
  );
};

export default CartSideMenu;
