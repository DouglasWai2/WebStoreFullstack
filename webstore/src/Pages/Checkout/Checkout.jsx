import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/Checkout/CheckoutForm";
import { useParams } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const stripePromise = loadStripe(
  "pk_test_51OD656IiYJkcjJsLpaFohGqlL805BDltCIO6GdGoK8T6YQGCN5w0lnkIw7HPh1mRqTMlv155HPiyxYEBfM9uryW600fN3Mq5aI"
);

const Checkout = () => {
  const { client_secret, productId } = useParams();
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret: client_secret,
    appearance,
  };

  const {
    data: product,
    loading,
    error,
  } = useFetchApi("/catalog/" + productId, "GET");

  console.log(product);

  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div className="shadow-md px-10 py-8 flex items-center gap-8">
        <div className="w-[450px] h-full object-contain aspect-[4/3]">
          {product ? (
            <>
              <img className="w-full" src={product.thumbnail} />
              <p>
                Voce está comprando:{" "}
                <span className="font-bold">{product.title}</span>
              </p>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
        <div className="min-w-[300px]">
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
