import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyMask } from "../../helpers/moneyMask";
import { useFetchApi } from "../../hooks/useFetchApi";
import price from "./price_example"

const ReviewCart = ({ user }) => {

  console.log(price)
 
  const navigate = useNavigate();
  const [body, setBody] = useState(null);
  const cartItems = JSON.parse(window.localStorage.getItem("cart"));

  useEffect(() => {
    const to = user?.address.filter((a) => a.main)[0].cep;

    if (user && to) {
      setBody({
        to,
      });
    }
  }, [user]);

  const { data, loading, error } = useFetchApi(
    "/shipment-calculate",
    "POST",
    body
  );

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div>
        
      </div>
    </main>
  );
};

export default ReviewCart;
