import StoreOrder from "../../../components/Store/Orders/StoreOrder";
import LoadingSpinner from "../../../components/shared/UI/LoadingSpinner";
import { useFetchApi } from "../../../hooks/useFetchApi";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { data, loading, error } = useFetchApi("/store/my-store/orders", "GET");
  const navigate = useNavigate();

  function onClick(url) {
    navigate(url);
  }

  return (
    <div className="max-w-[1440px] px-4 py-5 mx-auto my-4 shadow bg-white rounded-lg">
      <h1 className="text-3xl">Pedidos:</h1>
      <table className="w-full text-center rounded overflow-hidden table-auto">
        <thead className="bg-gray-600 text-white max-sm:hidden">
          <tr className="">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Resumo</th>
            <th className="px-4 py-2">Usuário</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Data</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {data &&
            data.map((item, i) => (
              <StoreOrder onClick={onClick} key={i} item={item} />
            ))}
        </tbody>
      </table>
      {loading && (
        <div className="w-full flex justify-center">
          <LoadingSpinner size="30px" />
        </div>
      )}
      {!data?.length && !loading && (
        <div className="w-full flex justify-center text-lg font-medium">
          Você ainda não recebeu nenhum pedido
        </div>
      )}
    </div>
  );
};

export default Orders;
