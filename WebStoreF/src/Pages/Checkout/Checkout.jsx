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
import Logo from "../../assets/logo-no-background-2.svg";
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
    if (data) {
      const total = calculateOrderAmount(data.items);
      setTotal(total);
    }
  }, [data]);

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#188fa7",
      borderRadius: "3px",
    },
  };
  const options = {
    clientSecret: client_secret,
    appearance,
  };

  return (
    <main className="min-h-screen h-full w-screen overflow-y-auto flex flex-col gap-4 justify-center items-center">
      <div
        className="shadow-md rounded-lg bg-[#fcfcfc] h-max max-w-[1200px]
      px-10 flex flex-col items-center py-8 gap-8 duration-300
      transition-all max-sm:px-2"
      >
        <img className="w-[300px]" src={Logo} />
        <div className="flex items-center h-full max-md:flex-col max-md:gap-4">
          {loading ? (
            <div className="w-full flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {" "}
              <div
                className="max-h-[600px] overflow-y-auto flex flex-col gap-3 border-r border-gray-300 px-6 
              max-md:border-b max-md:border-r-0 max-md:py-4 max-md:px-0"
              >
                {data &&
                  data.items.map(({ products, shipment }, i) => (
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
                        loading={loading}
                        currentShipment={shipment}
                        shipment={shipment}
                        index={i}
                      />
                    </CheckoutSection>
                  ))}
              </div>
              <div className="w-full px-6 max-md:px-0">
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm total={total} />
                </Elements>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Checkout;
