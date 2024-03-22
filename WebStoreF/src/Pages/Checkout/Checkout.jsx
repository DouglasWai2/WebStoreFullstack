import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/Checkout/CheckoutForm";
import { useParams } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { calculateOrderAmount } from "../../helpers/totalSum";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import CheckoutSection from "../../components/Checkout/CheckoutSection";
import CheckoutProduct from "../../components/Checkout/CheckoutProduct";
import CheckoutShipment from "../../components/Checkout/CheckoutShipment";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.STRIPE_KEY);

const Checkout = ({ user }) => {
  const [total, setTotal] = useState(0);
  const { client_secret } = useParams();
  const { order_id } = useParams();

  const { data, loading, error } = useFetchApi(
    "/order/retrieve/" + order_id,
    "GET"
  );

  useEffect(() => {
    if(data){
      const total =calculateOrderAmount(data.items);
      setTotal(total);
    }
  }, [data])

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret: client_secret,
    appearance,
  };

  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div
        className="relative shadow-md rounded-lg bg-[#fcfcfc] max-h-[900px] max-w-[1200px]
      px-10 py-8 flex items-center gap-8 duration-300 
      transition-all"
      >
        {loading ? (
          <div className="w-full flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {" "}
            <div className="max-h-full flex flex-col gap-3 border-r border-gray-300 pr-10">
              {data && data.items.map(({products, shipment}, i) => (
                <CheckoutSection index={i} >
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
                    loading={loading}
                    currentShipment={shipment}
                    shipment={shipment}
                    index={i}
                  />
                </CheckoutSection>
              ))}
            </div>
            <div className="w-full h-full px-4">
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm total={total} />
              </Elements>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Checkout;
