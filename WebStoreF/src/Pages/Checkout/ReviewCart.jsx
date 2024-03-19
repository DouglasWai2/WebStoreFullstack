import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyMask } from "../../helpers/moneyMask";
import { useFetchApi } from "../../hooks/useFetchApi";
import price from "./price_example";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

const ReviewCart = ({ user }) => {
  const navigate = useNavigate();
  const [body, setBody] = useState(null);
  const [currentShipment, setCurrentShipment] = useState([]);

  console.log(price);

  useEffect(() => {
    const to = user?.address.filter((a) => a.main)[0].cep;

    if (user && to) {
      setBody({
        to,
      });
    }
  }, [user]);

  const { data, loading, error } = useFetchApi(
    "/shipment-calculate",
    "POST",
    body
  );

  useEffect(() => {
    var value;
    console.log(currentShipment)
  }, [currentShipment]);

  return (
    <main className="w-screen h-screen flex items-center justify-center px-1 overflow-y-scroll">
      <div className="h-full">
        <div className="text-3xl font-bold">Resumo do pedido</div>
        <div className="flex flex-col gap-4">
          {price.map(({ store, products, shipment }, i) => {
            return (
              <div className="shadow-md py-4 px-2 rounded-lg bg-[#fcfcfc]" key={i}>
                <div>Vendido por: {store.storeName}</div>
                {products.map(({ product }, j) => {
                  return (
                    <div
                      key={j}
                      className="flex justify-between items-center py-2 mx-1 border-b-[1px] border-black text-sm"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="h-[80px] w-[80px] object-contain">
                          <img
                            className="h-full object-contain"
                            src={product.thumbnail}
                          />
                        </div>
                        <div>{product.title}</div>
                      </div>
                      <div className="mx-2 w-max">{products[j].quantity}x</div>
                      <div className="w-max justify-self-end">{moneyMask(product.price)}</div>
                    </div>
                  );
                })}
                <div className="text-justify font-bold flex justify-between mt-2">
                  <p>Subtotal </p>
                  <p>
                    {moneyMask(
                      products
                        .reduce((acc, { quantity, product }) => {
                          return acc + quantity * product.price;
                        }, 0)
                        .toFixed(2)
                    )}
                  </p>
                </div>
                <div className="mt-2">Frete:{}</div>
                <div id={store._id} className="max-h-0 overflow-hidden">
                  {shipment.map((item) => (
                    <label
                      for={item.name + i}
                      className="grid grid-cols-4 items-center py-2 odd:bg-[#f5f5f5] px-3"
                      key={item.id}
                    >
                      <img className="h-[10px]" src={item.company.picture} />

                      <p>{item.name}</p>
                      <div className="flex justify-center text-sm">
                        {!item.error &&
                          item.custom_delivery_range.min +
                            " - " +
                            item.custom_delivery_range.max + " dias úteis"}
                        {item.error && "Indisponível"}                       
                      </div>
                      <div className="flex gap-3 item-center justify-end">
                        {item.error ? (
                          <FontAwesomeIcon
                            className="text-gray-400"
                            icon={faBan}
                          />
                        ) : (
                          <div>{item.custom_price}</div>
                        )}
                        <input
                          id={item.name + i}
                          name={"shipment-method-" + i}
                          type="radio"
                          onChange={() => {
                            setCurrentShipment((p) => (p[i] = item.name));
                          }}
                          disabled={item.error}
                        />
                      </div>
                    </label>
                  ))}
                </div>
                <div>
                  <button
                    className="hover:underline text-blue-600"
                    onClick={() => {
                      document
                        .getElementById(store._id)
                        .classList.toggle("max-h-0");
                      document
                        .getElementById(store._id)
                        .classList.toggle("animate-expand");
                    }}
                  >
                    Alterar frete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
          <div className="flex justify-between">
            <div>Total</div>
            <div></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReviewCart;
