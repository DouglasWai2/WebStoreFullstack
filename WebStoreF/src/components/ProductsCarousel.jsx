import React, { useEffect, useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import ProductCard from "./Store/MyStore/ProductCard";

const ProductsCarousel = ({ text, queries, from, to, category }) => {
  const [productsUrl, setProductsUrl] = useState(null);
  const [toT, setToT] = useState(to);

  useEffect(() => {
    if (category) {
      setProductsUrl(`/catalog/category/${category}`);
    }
  }, [category, queries, toT]);

  const {
    data: products,
    loading: fetching,
    e,
  } = useFetchApi(productsUrl, "GET");

  return (
    <div className="bg-white py-6 px-4 max-w-[1440px] shadow rounded-md">
      <h1 className="text-2xl">Baseado no seu interesse em {category}</h1>
      <div className="py-5 flex gap-6 overflow-x-scroll scroll !scrollbar-track-black">
        {products?.map((item, index) => {
          return (
            <ProductCard
              className={"!min-w-[200px] !text-sm"}
              key={index}
              item={item}
            />
          );
        })}
        {products?.map((item, index) => {
          return (
            <ProductCard
              className={"!min-w-[200px] !text-sm"}
              key={index}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductsCarousel;
