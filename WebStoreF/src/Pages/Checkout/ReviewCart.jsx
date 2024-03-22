import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { moneyMask } from "../../helpers/moneyMask";
import { useFetchApi } from "../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCreditCard } from "@fortawesome/free-solid-svg-icons";
// import price from "./price_example";
import SkeletonReviewCart from "../../components/Checkout/ReviewCart/SkeletonReviewCart";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const ReviewCart = ({ user }) => {
  const { id } = useParams();
  const [body, setBody] = useState(null);
  const [body_2, setBody_2] = useState(null);
  const [currentShipment, setCurrentShipment] = useState([]);
  const [cep, setCep] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      const to = user.address.filter((a) => a.main)[0]?.cep;
      to && setCep(to);

      if (id !== "review-cart") return setBody({ to, id, quantity: 1 });
      else return setBody({ to });
    }
  }, [user]);

  const {
    data: price,
    loading,
    error,
  } = useFetchApi("/shipment-calculate", "POST", body);
  const {
    data,
    loading: loadingOrder,
    error: errorOrder,
  } = useFetchApi("/order/create", "POST", body_2);

  useEffect(() => {
    if (price) setCurrentShipment([]);
  }, [price]);

  const handleSubmit = () => {
    const items = [];

    price.forEach((p, i) => {
      items.push({
        store: p.store,
        products: price[i].products,
        shipment: currentShipment["shipment-method-" + i],
        shipment_hash: currentShipment["shipment-method-hash-" + i],
      });
    });


    setBody_2({
      order: {
        items,
      },
    });
  };

  useEffect(() => {
    if (price) {
      const total =
        price.reduce((acc, { products }) => {
          return (
            acc +
            products.reduce(
              (acc, item) =>
                acc +
                Number(item.quantity) *
                  (
                    item.product.price -
                    item.product.price * item.product.discount
                  ).toFixed(2),
              0
            )
          );
        }, 0) +
        Object.keys(currentShipment).reduce((acc, i) => {
          if (!currentShipment["shipment-method-" + i]?.custom_price)
            return acc;
          return (
            acc +
            parseFloat(currentShipment["shipment-method-" + i]?.custom_price)
          );
        }, 0);

      setTotal(total);
    }
  }, [currentShipment, price]);

  return (
    <main className="w-screen h-screen flex items-center justify-center py-1 px-1 overflow-y-scroll sm:py-4">
      <div className="h-full max-w-[800px] w-full">
        <div className="text-3xl font-bold">Resumo do pedido</div>
        <div className="flex flex-col gap-4">
          {!price && loading
            ? [1, 2].map(() => <SkeletonReviewCart />)
            : price &&
              price.map(({ store, products, shipment, shipment_hash }, i) => {
                return (
                  <div
                    className="shadow-md py-4 px-2 rounded-lg bg-[#fcfcfc] border-b-[1px] border-[#152128] text-sm lg:px-6"
                    key={i}
                  >
                    <div>Vendido por: {store.storeName}</div>
                    {products.map(({ product }, j) => {
                      return (
                        <div
                          key={j}
                          className="flex justify-between items-center border-b-[1px] border-gray-300 text-sm py-2 mx-1"
                        >
                          <div className="flex gap-3 items-center">
                            <div className="h-[80px] w-[80px] object-contain text-center">
                              <img
                                className="h-full object-contain"
                                src={product.thumbnail}
                              />
                            </div>
                            <div>{product.title}</div>
                          </div>
                          <div className="mx-2 w-max">
                            {products[j].quantity}x
                          </div>
                          <div className="w-max flex flex-col justify-self-end">
                            {product.discount > 0 && (
                              <span className="strikethrough mr-2 text-nowrap h-min text-xs">
                                {moneyMask(product.price)}
                              </span>
                            )}
                            <span>
                              {moneyMask(
                                (
                                  product.price -
                                  product.price * product.discount
                                ).toFixed(2)
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-justify font-bold flex justify-between mt-2">
                      <p>Subtotal </p>
                      <p>
                        {moneyMask(
                          products
                            .reduce((acc, { quantity, product }) => {
                              return (
                                acc +
                                quantity *
                                  (
                                    product.price -
                                    product.price * product.discount
                                  ).toFixed(2)
                              );
                            }, 0)
                            .toFixed(2)
                        )}
                      </p>
                    </div>
                    <div className="mt-2 grid grid-cols-4 justify-between py-4">
                      <p className="font-bold">Frete:</p>
                      {!loading && currentShipment["shipment-method-" + i] ? (
                        <>
                          {" "}
                          <p>{currentShipment["shipment-method-" + i].name}</p>
                          <p className="justify-self-center">
                            {currentShipment["shipment-method-" + i]
                              .custom_delivery_range.min +
                              " - " +
                              currentShipment["shipment-method-" + i]
                                .custom_delivery_range.max}{" "}
                            dias úteis
                          </p>
                          <p className="justify-self-end font-bold">
                            {moneyMask(
                              currentShipment["shipment-method-" + i]
                                .custom_price
                            )}
                          </p>
                        </>
                      ) : !loading && shipment ? (
                        `Selecione o frete`
                      ) : (
                        "Insira um cep"
                      )}
                      {loading && <LoadingSpinner />}
                    </div>
                    <div id={store._id} className="max-h-0 overflow-hidden">
                      {!loading &&
                        shipment &&
                        shipment.map((item) => (
                          <label
                            htmlFor={item.name + i}
                            className="grid grid-cols-4 gap-3 bg-white text-xs 
                      items-center py-2 odd:bg-[#f5f5f5] px-3 cursor-pointer "
                            key={item.id}
                          >
                            <img
                              className="h-[10px]"
                              src={item.company.picture}
                            />

                            <p>{item.name}</p>
                            <div className="flex  justify-center text-xs">
                              {!item.error &&
                                item.custom_delivery_range.min +
                                  " - " +
                                  item.custom_delivery_range.max +
                                  " dias úteis"}
                              {item.error && "Indisponível"}
                            </div>
                            <div className="flex gap-2 item-center justify-self-end w-max">
                              {item.error ? (
                                <FontAwesomeIcon
                                  className="text-gray-400 mr-2"
                                  icon={faBan}
                                />
                              ) : (
                                <div>{moneyMask(item.custom_price)}</div>
                              )}
                              <input
                                id={item.name + i}
                                name={"shipment-method-" + i}
                                type="radio"
                                onChange={() => {
                                  setCurrentShipment((p) => ({
                                    ...p,
                                    ["shipment-method-" + i]: item,
                                    ["shipment-method-hash-" + i]:
                                      shipment_hash,
                                  }));
                                }}
                                disabled={item.error}
                              />
                            </div>
                          </label>
                        ))}
                    </div>
                    <div>
                      {shipment && (
                        <button
                          className="rounded-lg border border-blue-600 px-2 py-1 
                    hover:bg-blue-600 hover:text-white duration-150 mt-3 text-blue-600"
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
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
        <div className="shadow-md py-4 px-2 rounded-lg bg-[#fcfcfc] border-b-[1px] border-[#152128] text-sm lg:px-6">
          <div className="">
            <p className="text-lg">CEP: </p>
            <input
              name="cep"
              placeholder="00000-000"
              value={cep}
              onChange={(e) => {
                setCep(e.target.value);
              }}
              className="border-b-[1px] border-[#152128] py-1 px-2"
            />
            <button
              onClick={() => {
                if (cep.length !== 8) {
                  alert("CEP inválido");
                  return;
                }
                setBody((p) => ({
                  ...p,
                  to: cep,
                }));
              }}
              className="rounded-lg border ml-2 border-blue-600 px-2 py-1 
                    hover:bg-blue-600 hover:text-white duration-150 mt-3 text-blue-600"
            >
              Calcular frete
            </button>
          </div>
        </div>
        <div
          className="mt-5 py-4 px-2 rounded-lg shadow-lg 
        bg-[#fcfcfc] border-b border-[#152128] 
        max-sm:sticky max-sm:bottom-0 max-sm:w-full max-sm:rounded-none"
        >
          <div className="flex justify-between text-xl">
            <div>Total</div>
            <div>{moneyMask(total.toFixed(2))}</div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#188fa7] mt-3 w-full px-2 py-2
                        rounded-md text-xl flex items-center justify-center text-white shadow
                        hover:brightness-75 mb-2
                        active:shadow-none active:text-black
                        duration-100"
          >
            {loadingOrder ? (
              <div className="loader-3 w-[1.4em]">
                <svg className="" viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              </div>
            ) : (
              <>
                <FontAwesomeIcon className="mr-2" icon={faCreditCard} />
                Ir para pagamento
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReviewCart;
