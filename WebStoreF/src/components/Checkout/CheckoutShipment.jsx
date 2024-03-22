import { moneyMask } from "../../helpers/moneyMask";
import LoadingSpinner from "../shared/LoadingSpinner";

const CheckoutShipment = ({loading, currentShipment, shipment, index}) => {
  return (
    <div className="mt-2 grid grid-cols-4 justify-between py-4">
      <p className="font-bold">Frete:</p>
      {!loading && currentShipment ? (
        <>
          {" "}
          <p>{currentShipment.name}</p>
          <p className="justify-self-center">
            {currentShipment.custom_delivery_range.min +
              " - " +
              currentShipment.custom_delivery_range
                .max}{" "}
            dias úteis
          </p>
          <p className="justify-self-end font-bold">
            {moneyMask(currentShipment.custom_price)}
          </p>
        </>
      ) : !loading && shipment ? (
        `Selecione o frete`
      ) : (
        "Insira um cep"
      )}
      {loading && (
        <div className="w-[2em]">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default CheckoutShipment;
