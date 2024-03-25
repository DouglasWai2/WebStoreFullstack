import { useSearchParams } from "react-router-dom";
import Logo from "../../assets/logo-no-background-2.svg";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useFetchApi } from "../../hooks/useFetchApi";

const PostCheckout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [payment, setPayment] = useState(searchParams.get("payment_intent"));

  console.log(payment)

  const {data, loading, error} = useFetchApi("/order/payment_status/" + payment, "GET");

  return (
    <main className="min-h-screen h-full w-screen overflow-y-auto flex flex-col gap-4 justify-center items-center">
      <div
        className="shadow-md rounded-lg bg-[#fcfcfc] h-max max-w-[1200px]
      px-10 flex flex-col items-center py-8 gap-8 duration-300
      transition-all max-sm:px-2"
      >
        <img className="w-[300px]" src={Logo} />
        {searchParams.get("redirect_status") === "succeeded" && (
          <div className="text-3xl font-bold text-green-700 flex gap-2">
            <FontAwesomeIcon icon={faCircleCheck} /><p>Pagamento realizado com sucesso</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default PostCheckout;
