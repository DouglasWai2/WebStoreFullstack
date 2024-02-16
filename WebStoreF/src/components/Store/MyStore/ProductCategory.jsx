import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useLocation, useParams } from "react-router-dom";
import { useFetchApi } from "../../../hooks/useFetchApi";

const ProductCategory = ({ text, queries, from, to, storeId }) => {
  const [productsUrl, setProductsUrl] = useState(null);
  const [toT, setToT] = useState(to)
  useEffect(() => {
    if (storeId) {
      setProductsUrl(`/catalog/all-products/${storeId}?${queries}&from=${from}&to=${toT}`);
    }
  }, [storeId, queries, toT]);

  const {
    data: products,
    loading: fetching,
    e,
  } = useFetchApi(productsUrl, "GET");

  return (
    <>
      <h1 className="text-2xl mt-10">{text}</h1>
      <div className="py-5 flex flex-wrap gap-6">
        {products
          ? products.map((item, index) => {
              return (
                <ProductCard
                  key={index}
                  item={item}
                />
              );
            })
          : ""}
      </div>
{/*       
      <div className="w-full h-[1px] my-4 border-b-2 border-black shadow-md cursor-pointer"
      onClick={()=>{
        setToT(toT + 2)
      }}
      >

      </div> */}
    </>
  );
};

export default ProductCategory;
