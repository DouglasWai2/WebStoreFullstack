import { orderStatus } from "../../helpers/OrderDictionary";

const CheckoutSection = ({
  children,
  index,
  store,
  color = "bg-[#fcfcfc]",
  status,
  tracking_code,
  shipment_date,
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
    </div>
  );
};

export default CheckoutSection;
