import React from "react";
import { useOutletContext } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { calculateOrderAmount } from "../../helpers/totalSum";
import { moneyMask } from "../../helpers/moneyMask";

const YourPurchases = () => {
  const { user } = useOutletContext();
  const { data, loading, error } = useFetchApi("/user/orders", "GET");

  const orderStatus = {
    PENDING_PAYMENT: { text: "Pagamento pendente", color: "text-yellow-500" },
    PAYMENT_APPROVED: { text: "Pagamento aprovado", color: "text-green-500" },
    PAYMENT_PROCESSING: { text: "Processando pagamento", color: "" },
    PAYMENT_REJECTED: { text: "Pagamento rejeitado", color: "text-red-500" },
    SHIPPED: { text: "Enviado", color: "" },
    DELIVERED: { text: "Entregue", color: "" },
    CANCELLED: { text: "Cancelado", color: "" },
  };

  return (
    <div className="w-full mx-6 px-5 py-8 bg-white shadow rounded-lg">
      {data &&
        data.map((order) => (
          <div
            className="w-full flex items-center 
          justify-between shadow-md rounded max-sm:flex-col px-5 py-3"
          >
            <div>
              <div>Data: {new Date(order.createdAt).toLocaleDateString()}</div>
              <div>Pedido: {order._id}</div>
              
              <div>Total: {moneyMask(calculateOrderAmount(order.items))}</div>
              <div>
                Status:{" "}
                <span className={orderStatus[order.status].color}>
                  {orderStatus[order.status].text}
                </span>
              </div>
            </div>
            <div>Ver detalhes</div>
          </div>
        ))}
    </div>
  );
};

export default YourPurchases;
