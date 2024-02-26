import React, { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import ProductCard from "./Store/MyStore/ProductCard";

const ProductsCarousel = ({ text, queries, from, to, category }) => {
  const [productsUrl, setProductsUrl] = useState(null);
  const [toT, setToT] = useState(to);
  const scrollRef = useRef(null);

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

  function scrollCarousel(value) {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += value;
    }
  }

  return (
    <div className="bg-white py-6 px-4 max-w-[1440px] shadow rounded-md">
      <h1 className="text-2xl">Baseado no seu interesse em {category}</h1>
      <div className="flex">
        <div
          onClick={() => {
            scrollCarousel(-1000);
          }}
          className="w-[50px]"
        ></div>
        <div
          ref={scrollRef}
          className="py-5 w-full flex gap-6 overflow-x-scroll carousel-scroll"
        >
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
        <div
          onClick={() => {
            scrollCarousel(1000);
          }}
          className="w-[50px]"
        ></div>
      </div>
    </div>
  );
};

export default ProductsCarousel;
