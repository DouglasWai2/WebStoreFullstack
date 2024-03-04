import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useFetchApi } from "../../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";

const ProductCategory = ({ text, queries, storeId }) => {
  const [productsUrl, setProductsUrl] = useState(null);
  useEffect(() => {
    if (storeId) {
      setProductsUrl(`/catalog/all-products/${storeId}?${queries}`);
    }
  }, [storeId, queries]);

  const {
    data: products,
    loading: fetching,
    e,
  } = useFetchApi(productsUrl, "GET");

  const [limit, setLimit] = useState(4);

  return fetching ? (
    <div className="flex justify-center py-24">
      <div className="loader"></div>
    </div>
  ) : (
    <>
      <div>
        <h1 className="text-2xl mt-10">{text}</h1>
        <div className="py-5 flex flex-wrap gap-6">
          {products &&
            products.map((item, index) => {
              if (index >= limit) return;
              return <ProductCard key={index} item={item} />;
            })}
        </div>
        {products && products.length > limit && (
          <div
            onClick={() => setLimit(limit + 9)}
            className="text-center cursor-pointer group hover:underline"
          >
            <p className="text-gray-600">
              Mostrar mais{" "}
              <FontAwesomeIcon
                className="text-gray-600 group-hover:animate-bounce"
                icon={faAnglesDown}
              />
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCategory;
