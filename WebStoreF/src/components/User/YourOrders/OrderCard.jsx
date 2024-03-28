import { moneyMask } from "../../../helpers/moneyMask";
import { calculateOrderAmount } from "../../../helpers/totalSum";

const OrderCard = ({ order }) => {
  const orderStatus = {
    PENDING_PAYMENT: { text: "Pagamento pendente", color: "text-yellow-500" },
    PAYMENT_APPROVED: { text: "Pagamento aprovado", color: "text-green-500" },
    PAYMENT_PROCESSING: { text: "Processando pagamento", color: "" },
    PAYMENT_REJECTED: { text: "Pagamento rejeitado", color: "text-red-500" },
    SHIPPED: { text: "Enviado", color: "" },
    DELIVERED: { text: "Entregue", color: "" },
    CANCELLED: { text: "Cancelado", color: "" },
  };

  let total = order.items.reduce((acc, item) => acc + item.products.length, 0);

  let current = 0;

  return (
    <div
      className="w-full flex items-center 
  justify-between shadow-md rounded max-sm:flex-col max-sm:gap-4 px-5 py-3"
    >
      <div className="">
        <div className="flex items-center mb-4 max-sm:flex-col">
          <div className="relative w-[160px] h-[80px] flex-shrink-0">
            {order.items.map((item) =>
              item.products.map((product, i) => {
                current++;
                if (current > 4) return;
                if (current === 4 && total > 4) {
                  return (
                    <div
                      key={i}
                      className="w-[60px] h-[60px] rounded-full border-2 border-white overflow-hidden absolute"
                      style={{
                        top: `${current * 5}px`,
                        left: `${current * 10}px`,
                        zIndex: current,
                      }}
                    >
                      <div className="w-full h-full absolute bg-white/70 z-10 flex items-center justify-center">
                        {" "}
                        + {current - 3}
                      </div>
                      <img
                        className="w-full h-full object-cover brightness-90"
                        src={product.product.thumbnail}
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="w-[60px] h-[60px] rounded-full border-2 border-white overflow-hidden absolute"
                    style={{
                      top: `${current * 5}px`,
                      left: `${current * 10}px`,
                      zIndex: current,
                    }}
                  >
                    <img
                      className="w-full h-full object-cover brightness-90"
                      src={product.product.thumbnail}
                    />
                  </div>
                );
              })
            )}
          </div>
          <div className="line-clamp-4">
            <p>Produtos: </p>
            {order.items.map((item) =>
              item.products.map((product) => (
                <p className="text-ellipsis">
                  {product.quantity} x {product.product.title}
                </p>
              ))
            )}
          </div>
        </div>
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
  );
};

export default OrderCard;
