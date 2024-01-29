import React from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { productId } = useParams();
  const { data, loading, error } = useFetchApi(
    "/api/catalog/" + productId,
    "GET"
  );
  return <div>ProductPage</div>;
};

export default ProductPage;
