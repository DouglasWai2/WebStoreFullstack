import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/Checkout/CheckoutForm";
import { useParams } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Checkout = () => {
  const { client_secret } = useParams();
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret: client_secret,
    appearance,
  };

  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div className="shadow-md px-10 py-8 flex items-center gap-8">
        <div className="w-[450px] h-full object-contain aspect-[4/3]">
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
