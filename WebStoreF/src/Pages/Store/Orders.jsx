import { useFetchApi } from "../../hooks/useFetchApi";

const Orders = () => {
    const {data, loading, error } = useFetchApi("/store/my-store/orders", "GET");

  return (
    <div className="max-w-[1440px] px-4 py-5 mx-auto my-4 shadow bg-white rounded-lg">
        <h1 className="text-3xl">Pedidos:</h1>
    </div>
  );
};

export default Orders;
