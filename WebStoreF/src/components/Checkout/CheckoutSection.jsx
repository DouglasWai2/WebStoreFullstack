import { orderStatus } from "../../helpers/OrderDictionary";

const CheckoutSection = ({
  children,
  index,
  store,
  color = "bg-[#fcfcfc]",
  status,
  tracking_code,
  shipment_date,
  handleProductRecived
}) => {
  return (
    <div
      className={
        "shadow-md w-full py-4 px-2 rounded-lg border-b-[1px] border-[#152128] text-sm lg:px-6 " +
        color
      }
      key={index}
    >
      <div className="flex flex-col gap-4">
        {store && <div>Vendido por: {store}</div>}
        {status && (
          <div>
            Status:{" "}
            <span className={orderStatus[status].color}>
              {orderStatus[status].text}
            </span>
            {status === "SHIPPED" && (
              <span className="ml-4">
                Data: {new Date(shipment_date).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
        {tracking_code && (
          <div className="text-lg font-medium">
            <span className="mr-4">
              Código de rastreamento: {tracking_code}
            </span>
          </div>
        )}
      </div>
      {children}
      {tracking_code && (
        <button
          onClick={handleProductRecived}
          className="bg-[#188fa7] mt-3 w-full px-2 py-2 rounded-md text-white hover:brightness-95"
        >
          Recebi o produto
        </button>
      )}
    </div>
  );
};

export default CheckoutSection;
