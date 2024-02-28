import React, { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import ProductCard from "./Store/MyStore/ProductCard";

const ProductsCarousel = ({ text, queries, from, to, category }) => {
  const [productsUrl, setProductsUrl] = useState(null);
  const [toT, setToT] = useState(to);
  const [phrase, setPhrase] = useState(null);
  const scrollRef = useRef(null);

  const prhasesArray = [
    `Recomendados para você em`,
    `De acordo com seu interesse em`,
    `Mais vendidos em`,
    `Destaques em`,
    `Baseado no seu interesse em`,
  ];

  useEffect(() => {
    if (category) {
      setPhrase(prhasesArray[Math.floor(Math.random() * prhasesArray.length)])
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
      <h1 className="text-2xl">     
        {phrase + ` ` + category}
      </h1>
      {fetching ? (
        <div className="flex justify-center py-24">
          <div className="loader"></div>
        </div>
      ) : (
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
          </div>
          <div
            onClick={() => {
              scrollCarousel(1000);
            }}
            className="w-[50px]"
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProductsCarousel;
