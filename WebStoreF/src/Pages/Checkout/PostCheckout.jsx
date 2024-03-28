import { Link, useSearchParams } from "react-router-dom";
import Logo from "../../assets/logo-no-background-2.svg";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useFetchApi } from "../../hooks/useFetchApi";
import CheckoutSection from "../../components/Checkout/CheckoutSection";
import CheckoutProduct from "../../components/Checkout/CheckoutProduct";
import CheckoutShipment from "../../components/Checkout/CheckoutShipment";
import LoadingSpinner from "../../components/shared/UI/LoadingSpinner";

const PostCheckout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [payment, setPayment] = useState(searchParams.get("payment_intent"));

  const { data, loading, error } = useFetchApi(
    "/order/payment_status/" + payment,
    "GET"
  );

  return (
    <main className="h-screen w-screen flex flex-col gap-4 justify-center items-center sm:py-3">
      <div
        className="shadow-md rounded-lg bg-[#fcfcfc] max-h-full
      px-10 flex flex-col items-center py-8 gap-8 duration-300
      transition-all max-sm:px-2"
      >
        <img className="w-[150px]" src={Logo} />
        {searchParams.get("redirect_status") === "succeeded" && (
          <div
            className="text-3xl w-full font-bold text-green-700 flex gap-2 items-center 
          justify-center max-sm:text-lg"
          >
            <FontAwesomeIcon icon={faCircleCheck} />
            <p className="">Pagamento realizado com sucesso</p>
          </div>
        )}
        {loading && !data && (
          <div className="w-[100px] h-[100px]">
            <LoadingSpinner />
          </div>
        )}
        {data && (
          <div className="h-full overflow-y-auto flex flex-col gap-3 px-6 max-md:py-4 max-md:px-0">
            {data.items.map(({ products, shipment }, i) => (
              <CheckoutSection index={i}>
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
                <CheckoutShipment
                  loading={false}
                  currentShipment={shipment}
                  shipment={shipment}
                  index={i}
                />
              </CheckoutSection>
            ))}
          </div>
        )}
        <div className="w-full flex justify-center items-center border border-gray-300 rounded-lg p-3">
          {loading && !data && (
            <div className="w-[50px] h-[50px]">
              <LoadingSpinner />
            </div>
          )}
          {data && (
            <div>
              <p>
                Entregar para:{" "}
                <span className="font-bold">{data.address.recieverName}</span>
              </p>
              <p>
                Em:{" "}
                <span className="font-bold">
                  {data.address.street} - No {data.address.number} /{" "}
                  {data.address.city} - {data.address.state}
                </span>
              </p>
            </div>
          )}
        </div>
        <div>
          <Link to="/user/your-orders" className="text-blue-600 hover:underline">
            <p>Ir para meus pedidos</p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PostCheckout;
