import React from "react";
import { useOutletContext } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";

import OrderCard from "../../components/User/YourOrders/OrderCard";
import LoadingSpinner from "../../components/shared/UI/LoadingSpinner";

const YourPurchases = () => {
  const { user } = useOutletContext();
  const { data, loading, error } = useFetchApi("/user/orders", "GET");

  return (
    <div className="w-full mx-6 flex flex-col items-center px-5 py-8 bg-white shadow rounded-lg max-sm:-mx-6">
      {loading && <LoadingSpinner size="50px" />}
      {data && data.map((order) => <OrderCard order={order} />)}
    </div>
  );
};

export default YourPurchases;
