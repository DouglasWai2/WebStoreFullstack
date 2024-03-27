import React, { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import ProductCard from "./Store/MyStore/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ProductsCarousel = ({ queries, category, topSelling, isMobile }) => {
  const [productsUrl, setProductsUrl] = useState(null);
  const [phrase, setPhrase] = useState(null);
  const [scrollable, setScrollable] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const prhasesArray = [
    `Recomendados para você em`,
    `De acordo com seu interesse em`,
    `Mais vendidos em`,
    `Destaques em`,
    `Baseado no seu interesse em`,
  ];

  useEffect(() => {
    if (category && !topSelling) {
      setPhrase(prhasesArray[Math.floor(Math.random() * prhasesArray.length)]);
      setProductsUrl(
        `/catalog/products/search/result?category=${category}&sortBy=sells&order=-1`
      );
    }
  }, [category, queries]);

  useEffect(() => {
    if (topSelling) {
      setProductsUrl(
        `/catalog/products/search/result?sortBy=sellsToday&order=-1`
      );
    }
  }, [topSelling]);

  const {
    data: products,
    loading: fetching,
    e,
  } = useFetchApi(productsUrl, "GET");

  useEffect(() => {
    if (scrollRef.current) {
      if (scrollRef.current.clientWidth < scrollRef.current.scrollWidth) {
        setScrollable(true);
      }
    }
  }, [scrollRef.current]);

  function scrollCarousel(value) {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += value;
    }
  }

  return (
    <div className="bg-white py-6 px-4 max-w-[1440px] w-full shadow rounded-md mt-6 max-sm:mx-2 max-sm:px-2">
      <h1 className="text-2xl px-4">
        {!topSelling ? phrase + ` ` + category : "Mais vendidos hoje"}
      </h1>
      {fetching ? (
        <div className="flex justify-center py-[150px]">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex items-center">
          {scrollable && !isMobile && (
            <div
              onClick={() => {
                scrollCarousel(-scrollRef.current.clientWidth);
              }}
              className="w-[50px] mr-[-25px] z-10 bg-white cursor-pointer rounded-full shadow h-[50px] flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-scroll py-5 px-4 w-full flex items-center gap-6 carousel-scroll"
          >
            {products &&
              products?.products.map((item, index) => {
                return (
                  <ProductCard className={"!text-sm"} key={index} item={item} />
                );
              })}
            {products && products.countQuery > products.products.length && (
              <div
                onClick={() =>
                  navigate(
                    `/catalog/products/search/result?${
                      category ? `category=${category}&` : ""
                    }&sortBy=${topSelling ? "sellsToday" : "sells"}&order=-1`
                  )
                }
                className="px-8 font-semibold hover:underline cursor-pointer text-center"
              >
                Ver todos
              </div>
            )}
          </div>

          {scrollable && !isMobile && (
            <div
              onClick={() => {
                scrollCarousel(scrollRef.current.clientWidth);
              }}
              className="w-[50px] ml-[-25px] bg-white  
              cursor-pointer rounded-full shadow h-[50px] flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsCarousel;
