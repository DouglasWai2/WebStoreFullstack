import React, { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import ProductCard from "./Store/MyStore/ProductCard";

const ProductsCarousel = ({ text, queries, from, to, category, topSelling }) => {
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
    if (category && !topSelling) {
      setPhrase(prhasesArray[Math.floor(Math.random() * prhasesArray.length)])
      setProductsUrl(`/catalog/category/${category}`);
    } 
  }, [category, queries, toT]);

  useEffect(() => {
    if (topSelling) {
      setProductsUrl(`/catalog`);
    }
  }, [topSelling]);

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
    <div className="bg-white py-6 px-4 max-w-[1440px] w-full shadow rounded-md">
      <h1 className="text-2xl">     
        {!topSelling ? phrase + ` ` + category : "Mais vendidos hoje"}
      </h1>
      {fetching ? (
        <div className="flex justify-center py-[150px]">
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
