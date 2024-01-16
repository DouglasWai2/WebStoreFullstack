import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useLocation, useParams } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";

const ProductCategory = () => {
  const { storeName, storeId } = useParams();
  const location = useLocation();
  const [productsUrl, setProductsUrl] = useState(null);

  useEffect(() => {
    setProductsUrl(
      `/api/catalog/all-products/${storeId}?&sortby=sells&order=desc`
    );
  }, []);

  const {
    data: products,
    loading: fetching,
    e,
  } = useFetchApi(productsUrl, "GET");

  return (
    <>
      <h1 className="text-2xl mt-10">Mais vendidos</h1>
      <div className="py-5 flex flex-wrap gap-6">
        {products && !fetching
          ? products.map((item, index) => {
              return (
                <ProductCard
                  key={index}
                  img={item.thumbnail}
                  title={item.title}
                  rating={item.rating}
                  price={item.price}
                />
              );
            })
          : ""}
      </div>
    </>
  );
};

export default ProductCategory;
