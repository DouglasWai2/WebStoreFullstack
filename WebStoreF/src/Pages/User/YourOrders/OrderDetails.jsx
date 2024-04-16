import { useNavigate, useParams } from "react-router-dom";
import { useFetchApi } from "../../../hooks/useFetchApi";
import { moneyMask } from "../../../helpers/moneyMask";
import {
  calculateOrderAmount,
  calculateSubTotal,
} from "../../../helpers/totalSum";
import { orderStatus } from "../../../helpers/OrderDictionary";
import LoadingSpinner from "../../../components/shared/UI/LoadingSpinner";
import CheckoutSection from "../../../components/Checkout/CheckoutSection";
import CheckoutProduct from "../../../components/Checkout/CheckoutProduct";
import CheckoutShipment from "../../../components/Checkout/CheckoutShipment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ConfirmBox from "../../../components/shared/UI/ConfirmBox";

const OrderDetails = () => {
  const { order_id } = useParams();
  const [url, setUrl] = useState(null);
  const [body, setBody] = useState(null);
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [storeId, setStoreId] = useState(null);

  const { data, loading, error } = useFetchApi(
    `/order/retrieve/${order_id}`,
    "GET"
  );

  const {
    data: received,
    loading: loadingRecieved,
    error: errorRecieved,
  } = useFetchApi("/order/received", "POST", body);

  const { data: client_secret, loading: loadingClientSecret } = useFetchApi(
    url,
    "GET"
  );

  useEffect(() => {
    if(received) {
      setConfirm(false);
    }
  }, [received])

  useEffect(() => {
    if (client_secret)
      navigate(
        "/checkout/payment/" + client_secret.client_secret + "/" + data._id
      );
  }, [client_secret]);

  return (
    <div className="w-full flex flex-col gap-3">
      <h1 className="text-2xl">Detalhes do pedido:</h1>
      {confirm && (
        <ConfirmBox
          handleCancel={() => setConfirm(false)}
          handleClick={() => {
            setBody({ orderId: order_id, storeId: storeId });
          }}
          loading={loadingRecieved}
          text="Deseja marcar como recebido?"
          buttonColor={"bg-green-500"}
          buttonText={"Marcar como recebido"}
        />
      )}
      {loading && (
        <div className="flex justify-center">
          <LoadingSpinner size="50px" />
        </div>
      )}
      {data && (
        <>
          {data.items.map(
            (
              {
                products,
                shipment,
                store,
                shipment_status,
                shipment_track_code,
                shipment_date,
              },
              i
            ) => (
              <CheckoutSection
                color="bg-white"
                status={shipment_status}
                store={store.storeName}
                tracking_code={shipment_track_code}
                shipment_date={shipment_date}
                index={i}
                handleProductRecived={() => {
                  setConfirm(true) 
                  setStoreId(store._id)
                }}
              >
                {products.map(({ product }, j) => (
                  <CheckoutProduct
                    price={products[j].currentPrice}
                    discount={products[j].currentDiscount}
                    thumbnail={product.thumbnail}
                    title={product.title}
                    index={j}
                    quantity={products[j].quantity}
                  />
                ))}
                <div className="text-justify font-bold flex justify-between mt-2">
                  <p>Subtotal </p>
                  <p>
                    {moneyMask(
                      calculateSubTotal(
                        products.map((item) => {
                          return {
                            quantity: item.quantity,
                            product: {
                              price: item.currentPrice,
                              discount: item.currentDiscount,
                            },
                          };
                        })
                      ).toFixed(2)
                    )}
                  </p>
                </div>
                <CheckoutShipment
                  loading={loading}
                  currentShipment={shipment}
                  shipment={shipment}
                  index={i}
                />
              </CheckoutSection>
            )
          )}
          <p>
            Data:{" "}
            <span className="font-medium">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p>
            Pedido: <span className="font-medium">#{data.order_number}</span>
          </p>

          <p>
            Total:{" "}
            <span className="font-medium">
              {moneyMask(calculateOrderAmount(data.items))}
            </span>
          </p>
          <p>
            Status:{" "}
            <span className={orderStatus[data.status].color}>
              {orderStatus[data.status].text}
            </span>
          </p>
          {data.status === "PENDING_PAYMENT" && (
            <button
              onClick={() => setUrl("/order/payment/" + data.payment_intent)}
              className="bg-[#188fa7] mt-3 w-full px-2 py-2
                        rounded-md text-xl flex items-center justify-center text-white shadow
                        hover:brightness-75 mb-2
                        active:shadow-none active:text-black
                        duration-100"
            >
              {loadingClientSecret ? (
                <LoadingSpinner color="white" />
              ) : (
                <>
                  <FontAwesomeIcon className="mr-2" icon={faCreditCard} />
                  Ir para pagamento
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default OrderDetails;
