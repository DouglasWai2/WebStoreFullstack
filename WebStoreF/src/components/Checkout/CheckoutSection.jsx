import { useNavigate } from "react-router-dom";
import { orderStatus } from "../../helpers/OrderDictionary";

const CheckoutSection = ({
  children,
  index,
  store,
  color = "bg-[#fcfcfc]"
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={
        "shadow-md w-full py-4 px-2 rounded-lg border-b-[1px] border-[#152128] text-sm lg:px-6 " +
        color
      }
      key={index}
    >
      {store && <div>Vendido por: {store}</div>}
      {children}

    </div>
  );
};

export default CheckoutSection;
