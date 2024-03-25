import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { moneyMask } from "../../helpers/moneyMask";
import { useFetchApi } from "../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { calculateShipment, calculateSubTotal } from "../../helpers/totalSum";
import SkeletonReviewCart from "../../components/Checkout/ReviewCart/SkeletonReviewCart";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorCard from "../../components/shared/ErrorCard";
import CheckoutProduct from "../../components/Checkout/CheckoutProduct";
import CheckoutSection from "../../components/Checkout/CheckoutSection";
import CheckoutShipment from "../../components/Checkout/CheckoutShipment";
import { CEPMask } from "../../helpers/CEPMask";
import WarningCard from "../../components/shared/WarningCard";

const ReviewCart = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [body, setBody] = useState(null);
  const [body_2, setBody_2] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [warning, setWarning] = useState(null);
  const [currentShipment, setCurrentShipment] = useState([]);
  const [address, setAddress] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      const to = user.address.filter((a) => a.main)[0];
      to && setAddress(to);

      if(!to.length) return
      if (id !== "review-cart") return setBody({ to: to.cep, id, quantity: 1 });
      else return setBody({ to: to.cep });
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

  useEffect(() => {
    if (data)
      navigate("/checkout/payment/" + data.client_secret + "/" + data.order_id);
  }, [data]);

  const handleSubmit = () => {
    const items = [];

    if (!address?._id){
      setWarning("Coloque as informções do endereço de entrega"); 
      return document.getElementById("address-warning").scrollIntoView({ behavior: "smooth" });
    }

    for (let i = 0; i < price.length; i++) {
      if (!currentShipment["shipment-method-" + i])
        return setErrorMessage("Selecione o(s) método(s) de envio");

      items.push({
        store: price[i].store,
        products: price[i].products,
        shipment: currentShipment["shipment-method-" + i],
        shipment_hash: price[i].shipment_hash,
      });
    }

    setBody_2({
      order: {
        items,
        address: address._id,
      },
    });
  };

  useEffect(() => {
    if (price) {
      const subTotal =
        price.reduce((acc, { products }) => {
          return acc + calculateSubTotal(products);
        }, 0) +
        calculateShipment(Object.keys(currentShipment), currentShipment);

      setTotal(subTotal);
    }
  }, [currentShipment, price]);

  return (
    <main className="w-screen h-screen flex items-center justify-center py-1 px-1 overflow-y-auto sm:py-4">
      {(errorMessage || warning) && (
        <div className="absolute top-10 animate-expand z-10">
          {errorMessage && (
            <ErrorCard
              invalid={errorMessage}
              handleClick={() => setErrorMessage(null)}
            />
          )}
          {warning && (
            <WarningCard
              warning={warning}
              handleClick={() => setWarning(null)}
            />
          )}
        </div>
      )}
      <div className="h-full max-w-[800px] w-full">
        <div className="text-3xl font-bold">Resumo do pedido</div>
        <div className="flex flex-col gap-4">
          {!price && loading
            ? [1, 2].map(() => <SkeletonReviewCart />)
            : price &&
              price.map(({ store, products, shipment, shipment_hash }, i) => {
                return (
                  <CheckoutSection index={i} store={store.storeName}>
                    {products.map(({ product }, j) => {
                      return (
                        <CheckoutProduct
                          price={product.price}
                          discount={product.discount}
                          thumbnail={product.thumbnail}
                          title={product.title}
                          index={j}
                          quantity={products[j].quantity}
                        />
                      );
                    })}
                    <div className="text-justify font-bold flex justify-between mt-2">
                      <p>Subtotal </p>
                      <p>{moneyMask(calculateSubTotal(products).toFixed(2))}</p>
                    </div>
                    <CheckoutShipment
                      loading={loading}
                      currentShipment={currentShipment["shipment-method-" + i]}
                      shipment={shipment}
                      index={i}
                    />
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
                                <div>
                                  {moneyMask(
                                    parseFloat(
                                      item.custom_price - item.discount
                                    ).toFixed(2)
                                  )}
                                </div>
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
                                  document
                                    .getElementById(store._id)
                                    .classList.toggle("max-h-0");
                                  document
                                    .getElementById(store._id)
                                    .classList.toggle("animate-expand");
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
                  </CheckoutSection>
                );
              })}
        </div>
        <div className="shadow-md py-4 px-2 rounded-lg bg-[#fcfcfc] border-b-[1px] border-[#152128] text-sm lg:px-6">
          <div className="">
            {address?._id && (
              <div className="flex justify-between items-center border border-gray-300 rounded-lg p-3">
                <div>
                  <p>
                    Entregar para:{" "}
                    <span className="font-bold">{address.recieverName}</span>
                  </p>
                  <p>
                    Em:{" "}
                    <span className="font-bold">
                      {address.street} - No {address.number} / {address.city} -{" "}
                      {address.state}
                    </span>
                  </p>
                </div>
                <Link to="/user/address" className="text-blue-600 hover:underline">
                  Alterar
                </Link>
              </div>
            )}
            <p className="text-lg mt-2">CEP: </p>
            <input
              name="cep"
              placeholder="00000-000"
              maxLength={9}
              value={CEPMask(address.cep)}
              onChange={(e) => {
                setAddress({ cep: e.target.value });
              }}
              className="border-b-[1px] border-[#152128] py-1 px-2"
            />
            <button
              onClick={() => {
                if (address.cep.replace("-", "").length !== 8) {
                  setErrorMessage("CEP inválido");
                  return;
                }
                setBody((p) => ({
                  ...p,
                  to: address.cep.replace("-", ""),
                }));
              }}
              className={
                "rounded-lg border ml-2 border-blue-600 px-2 py-1 " +
                "hover:bg-blue-600 hover:text-white duration-150 mt-3 text-blue-600"
              }
            >
              Calcular frete
            </button>
          </div>
          {warning && (
            <div className="mt-2">
              <Link to="/user/new-address">
                <p id="address-warning" className="text-yellow-500 hover:underline">
                  Clique aqui para colocar informações do seu endereço de
                  entrega
                </p>
              </Link>
            </div>
          )}
        </div>
        <div
          className="mt-5 py-4 px-2 rounded-lg shadow-lg 
        bg-[#fcfcfc] border-b border-[#152128] 
        max-sm:sticky max-sm:w-full max-sm:rounded-none"
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
              <div className="w-[1.4em]">
                <LoadingSpinner color="white" />
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
