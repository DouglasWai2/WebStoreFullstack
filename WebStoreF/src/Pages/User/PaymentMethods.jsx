import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import SetupForm from "./SetupForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   "pk_test_51OD656IiYJkcjJsLpaFohGqlL805BDltCIO6GdGoK8T6YQGCN5w0lnkIw7HPh1mRqTMlv155HPiyxYEBfM9uryW600fN3Mq5aI"
// );

const PaymentMethods = () => {


  // const [form, setForm] = useState(false);
  // const [clientSecret, setClientSecret] = useState("");

  // const getClientSecret = async () => {
  //   const accessToken = window.localStorage.getItem("accessToken");

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/test/payment/${accessToken}`,
  //       { withCredentials: true }
  //     );
  //     setClientSecret(response.data.client_secret);

  //   } catch (error) {
  //   }
  // };

  // useEffect(() => {
  //   // getClientSecret();
  // }, []);

  return <div>PaymentMethods</div>
  
  return (
    <div className="w-full flex gap-5 flex-wrap max-md:justify-center">
      {!form ?
      <div
        onClick={() => setForm(true)}
        className="
      bg-white border-[1px] max-w-[250px] h-fit shadow-md p-3 flex items-center 
      gap-2 transition-all cursor-pointer duration-500 hover:brightness-75"
      >
        <h1>Adicionar novo método de pagamento</h1>
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ color: "#94989e" }}
          size="2xl"
        />
        </div>
        :
      stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{clientSecret, }}>
          <SetupForm />
        </Elements>
      )}
    </div>
  );
};

export default PaymentMethods;
