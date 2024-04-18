import { useParams } from "react-router-dom";
import { useFetchApi } from "../../../hooks/useFetchApi";
import LoadingSpinner from "../../../components/shared/UI/LoadingSpinner";
import { orderStatus } from "../../../helpers/OrderDictionary";
import { moneyMask } from "../../../helpers/moneyMask";
import { calculateOrderAmount } from "../../../helpers/totalSum";
import { CPFMask } from "../../../helpers/CPFMask";
import { useEffect, useState } from "react";

const Details = () => {
  const [body, setBody] = useState(null);
  const [url, setUrl] = useState(null);
  const { order_id } = useParams();

  const {
    data: status,
    loading: submitting,
    error: errorStatus,
  } = useFetchApi(url, "POST", body);

  const { data, loading, error, refresh } = useFetchApi(
    `/store/my-store/orders/${order_id}`,
    "GET"
  );

  useEffect(() => {
    if (status) {
      refresh();
    }
  }, [status]);

  return (
    <div className="max-w-[1440px] px-4 py-5 mx-auto my-4 shadow bg-white rounded-lg">
      <p className="text-3xl mb-3">Detalhes do pedido</p>
      {loading && <LoadingSpinner size="50px" />}
      {data && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p>Número do pedido: #{data.order_number}</p>
            <p
              className={
                data.items[0].shipment_status
                  ? orderStatus[data.items[0].shipment_status].color
                  : orderStatus[data.status].color
              }
            >
              <span className="text-black">Status:</span>{" "}
              {data.items[0].shipment_status
                ? orderStatus[data.items[0].shipment_status].text
                : orderStatus[data.status].text}
            </p>
          </div>
          <div className="border border-gray-200 rounded p-2">
            <p className="font-medium text-lg">Items:</p>
            {data.items[0].products.map((item, i) => {
              return (
                <div
                  onClick={() =>
                    window.open(
                      `/catalog/${item.product.title.replace("/", "%2F")}/${
                        item.product._id
                      }`,
                      "_blank"
                    )
                  }
                  className="flex gap-4 items-center cursor-pointer group"
                >
                  <img
                    className="w-[60px] h-[60px] object-contain"
                    src={item.product.thumbnail}
                    alt="product image"
                  />
                  <p className="group-hover:underline" key={i}>
                    {item.product.title} -{" "}
                    <span className="text-nowrap p-1">
                      Quantidade: {item.quantity}
                    </span>
                  </p>
                  <div>
                    {item.currentDiscount > 0 && (
                      <p className="strikethrough mr-2 text-nowrap h-min w-min text-xs group-hover:underline">
                        {item.currentPrice}
                      </p>
                    )}
                    <p className="text-nowrap flex flex-wrap gap-1 group-hover:underline">
                      {moneyMask(
                        (
                          item.currentPrice -
                          item.currentPrice * item.currentDiscount
                        ).toFixed(2)
                      )}
                      {item.currentDiscount > 0 && (
                        <span className="text-xs text-wrap">
                          {" "}
                          ({item.currentDiscount * 100}% de desconto)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border border-gray-200 rounded p-2">
            <p className="font-medium text-lg">Método de envio:</p>
            <div className="flex gap-4 items-center mb-3">
              Serviço:
              <p className="font-medium">{data.items[0].shipment.name}</p>
              <img
                className="w-[50px]"
                src={data.items[0].shipment.company.picture}
              />
            </div>
            <div className="p-3 shadow rounded-lg">
              <p>Pacotes:</p>
              {data.items[0].shipment.packages.map((item, i) => {
                return (
                  <>
                    <div className="p-2">
                      <p key={i}>dimensões:</p>
                      <div className="p-2">
                        <p>Altura: {item.dimensions.height} cm</p>
                        <p>Largura: {item.dimensions.length} cm</p>
                        <p>Profundidade: {item.dimensions.width} cm</p>
                        <p>Peso: {item.weight} kg</p>
                        <p>Formato: {item.format}</p>
                      </div>
                      <p>Preço: {item.price}</p>
                      <p>Desconto: {item.discount}</p>
                    </div>
                    <p>
                      Produtos:{" "}
                      {item.products.map((product, i) => (
                        <p className="px-2" key={i}>
                          id: {product.id} Quantidade: {product.quantity}
                        </p>
                      ))}
                    </p>
                    <p>Tempo estimado de entrega: </p>
                    <p className="p-2">
                      {data.items[0].shipment.delivery_range.min} à{" "}
                      {data.items[0].shipment.delivery_range.max} dias úteis
                    </p>
                  </>
                );
              })}
              <p>
                Frete:{" "}
                {moneyMask(
                  (
                    data.items[0].shipment.custom_price -
                    data.items[0].shipment.discount
                  ).toFixed(2)
                )}
              </p>
            </div>
          </div>
          <div className="border border-gray-200 rounded p-2">
            <p className="font-medium text-lg">Usuário:</p>
            <p>Nome: {data.user.name + " " + data.user.lastName}</p>
            <p>Email: {data.user.email}</p>
          </div>
          <div className="border border-gray-200 rounded p-2">
            <p className="font-medium text-lg">Endereço de entrega:</p>
            <p>
              Entregar para:{" "}
              <span className="">
                {data.address.recieverName} - CPF: {CPFMask(data.address.CPF)}
              </span>
            </p>
            <p>
              Em:{" "}
              <span className="">
                {data.address.street} - No {data.address.number} /{" "}
                {data.address.city} - {data.address.state}
              </span>
            </p>
          </div>
          <div>
            <p className="font-medium text-lg">
              Total: {moneyMask(calculateOrderAmount(data.items))}
            </p>
          </div>
          {data.status === "PENDING_PAYMENT" && <p>Aguardando pagamento...</p>}
          {data.status === "PAYMENT_APPROVED" &&
            !data.items[0].shipment_status && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    setUrl("/store/my-store/order/status");
                    setBody({
                      order_id: data._id,
                      action: "accept",
                    });
                  }}
                  className="bg-blue-600 flex justify-center text-white hover:brightness-95 rounded px-3 py-1"
                >
                  {submitting || loading ? (
                    <LoadingSpinner size="30px" color="white" />
                  ) : (
                    'Aceitar pedido e marcar como "Processando para envio"'
                  )}
                </button>
                <button
                  onClick={() => {
                    setBody({
                      order_id: data._id,
                      action: "reject",
                    });
                  }}
                  className="bg-red-600 flex justify-center text-white hover:brightness-95 rounded px-3 py-1"
                >
                  {submitting ? (
                    <LoadingSpinner size="24px" color="white" />
                  ) : (
                    "Recusar pedido"
                  )}
                </button>
              </div>
            )}
          {data.items[0].shipment_status === "PREPARING_SHIPMENT" && (
            <>
              <label
                className="text-lg flex gap-2 max-sm:flex-col"
                htmlFor="shipment-code"
              >
                <p>Digite aqui o código de rastreio:</p>
                <input
                  className="px-1 mx-2 border-b flex-shrink-0"
                  id="shipment-code"
                  type="text"
                  placeholder="PC123456789BR"
                />
                <button
                  onClick={() => {
                    setUrl("/store/my-store/order/shipment-tracking-code");
                    setBody({
                      tracking_code:
                        document.getElementById("shipment-code").value,
                      order_id: data._id,
                    });
                  }}
                  className="w-full flex items-center justify-center mx-2 p-1 px-3 rounded bg-blue-600 text-white hover:brightness-95"
                >
                  {submitting || loading ? (
                    <LoadingSpinner size="24px" color="white" />
                  ) : (
                    "Definir código de rastreio e marcar como 'Enviado'"
                  )}
                </button>
              </label>
            </>
          )}
          {data.items[0].shipment_track_code && (
            <p className="text-lg">
              Código de rastreio: {data.items[0].shipment_track_code}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Details;
