import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { moneyMask } from "../../helpers/moneyMask";
import Delayed from "./Delayed";
import { useNavigate } from "react-router-dom";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { useCart } from "../../hooks/useCart";

const CartSideMenu = ({ setCart, cartRef }) => {
  const navigate = useNavigate();
  const {removeFromCart} = useCart()
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart"))
  );

  useOutsideAlerter(cartRef, () => setCart(false));

  function totalSum(items) {
    var total = 0;
    items.forEach((item) => {
      total += (item.price - item.price * item.discount) * item.quantity;
    });

    return total;
  }

  useEffect(() => {
    const handleStorage = () => {
      setCartItems(JSON.parse(localStorage.getItem("cart")));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);


  return (
    <aside
      ref={cartRef}
      className="fixed bg-white shadow-md right-0 top-0 flex flex-col justify-between w-[600px] 
    h-screen animate-appear py-8 px-3 z-50 max-lg:w-2/3 max-md:w-3/4 max-sm:w-full"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-2xl text-slate-900">
            <FontAwesomeIcon icon={faCartShopping} className="mr-3" />
            Carrinho
          </p>
          <button
            className="text-xl font-semibold border-2 border-slate-900 
            rounded-lg px-3 py-1 hover:bg-slate-900 hover:text-white 
            active:bg-slate-900 active:text-white"
            onClick={() => {
              setCart(false);
            }}
          >
            X
          </button>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-5 mt-6">
          <Delayed>
            {cartItems && cartItems.length ? (
              cartItems.map((item, index) => {
                return (
                  <div
                    onClick={() => {
                      navigate("/catalog/" + item.title + "/" + item.productId);
                      setCart(false);
                    }}
                    className="border-2 flex items-center justify-between
                     border-slate-200 rounded-md px-4 py-3 transition-colors duration-200
                      hover:border-slate-900 animate-appear cursor-pointer active:bg-gray-200"
                    key={item.productId}
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
                        <p className="font-semibold">{item.title}</p>
                        <p>
                          Quantidade:{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
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
                          <span className="font-semibold">
                            {moneyMask(
                              Number(
                                item.price - item.discount * item.price
                              ).toFixed(2)
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.productId);
                        setCartItems(
                          JSON.parse(window.localStorage.getItem("cart"))
                        );
                      }}
                      className="bg-slate-200 p-2 h-[50px] px-6 rounded-md 
                      text-red-500  hover:bg-red-500 hover:text-white 
                      duration-100 active:bg-red-500 active:text-white"
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
      <Delayed>
        <div className="animate-appear">
          {cartItems && cartItems.length && (
            <>
              <p className="text-lg font-semibold mb-4">
                Total: {moneyMask(Number(totalSum(cartItems)).toFixed(2))}
              </p>
              <button
                onClick={() => {
                  navigate("/checkout/review-cart");
                }}
                className="bg-[#188fa7] w-full px-16 py-2 text-lg
          rounded-md text-white shadow 
          hover:brightness-75
          active:shadow-none active:text-black
          duration-100"
              >
                Finalizar compra
              </button>
            </>
          )}
        </div>
      </Delayed>
    </aside>
  );
};

export default CartSideMenu;
