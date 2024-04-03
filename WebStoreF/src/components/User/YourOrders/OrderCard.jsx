import { useNavigate } from "react-router-dom";
import { moneyMask } from "../../../helpers/moneyMask";
import { calculateOrderAmount } from "../../../helpers/totalSum";
import { orderStatus } from "../../../helpers/OrderDictionary";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  let total = order.items.reduce((acc, item) => acc + item.products.length, 0);

  let current = 0;

  return (
    <div
      onClick={() => navigate("/user/your-orders/" + order._id)}
      className="w-full cursor-pointer flex items-center active:bg-gray-200 duration-500
  justify-between shadow rounded max-sm:flex-col max-sm:gap-4 px-5 py-3"
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
                        + {total - 3}
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
          <div>
            <div className="h-[6rem] overflow-hidden">
              <p>Produtos: </p>
              {order.items.map((item) =>
                item.products.map((product, i) => (
                  <p key={i} className="line-clamp-1 font-medium">
                    {product.quantity} x {product.product.title}
                  </p>
                ))
              )}
            </div>
            {total > 3 && <p> + {total - 3} itens</p>}
          </div>
        </div>
        <p>
          Data:{" "}
          <span className="font-medium">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </p>
        <p>
          Pedido: <span className="font-medium">#{order.order_number}</span>
        </p>

        <p>
          Total:{" "}
          <span className="font-medium">
            {moneyMask(calculateOrderAmount(order.items))}
          </span>
        </p>
        <p>
          Status:{" "}
          <span className={orderStatus[order.status].color}>
            {orderStatus[order.status].text}
          </span>
        </p>
      </div>
      <div className="hover:underline">Ver detalhes</div>
    </div>
  );
};

export default OrderCard;
