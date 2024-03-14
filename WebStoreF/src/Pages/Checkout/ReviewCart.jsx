import React from "react";
import { useNavigate } from "react-router-dom";
import { moneyMask } from "../../helpers/moneyMask";
import { useApi } from "../../hooks/useApi";
import axios  from "axios";

const ReviewCart = ({ id }) => {
  const api = useApi();
  const navigate = useNavigate();

  const cartItems = JSON.parse(window.localStorage.getItem("cart"));

  const clientId = 4287;
  const redirect_uri = `${import.meta.env.VITE_API_URL}/api/v1/frete/callback`;

  async function integrateApi() {
    const response = await axios.get(import.meta.env.VITE_API_URL + "/frete");
    console.log(response);
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div>
        {cartItems.map((item, index) => {
          return (
            <div
              className="border-b-[1px] border-gray-400 flex items-center justify-between px-4 py-3"
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
                        Number(item.price - item.discount * item.price).toFixed(
                          2
                        )
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={integrateApi} className="bg-black text-white">
          Integrar
        </button>
        <a
          href={`https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&state=${id}&scope=shipping-calculate`}
          target="_blank"
        >
          TEste
        </a>
      </div>
    </main>
  );
};

export default ReviewCart;
