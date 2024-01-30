import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useParams } from "react-router-dom";
import ImageMagnifier from "../../components/Store/ImageMagnifier";
import ProductPreview from "../../components/Store/ProductPreview";
import { moneyMask } from "../../helpers/moneyMask";

const ProductPage = () => {
  const { productId } = useParams();
  const [mainImage, setMainImage] = useState("");
  const {
    data: product,
    loading,
    error,
  } = useFetchApi("/api/catalog/" + productId, "GET");

  useEffect(() => {
    if (product) setMainImage(product.thumbnail);
  }, [product]);

  return (
    product && 
    <article>
    <div className="w-full h-full flex shadow-md">
      <section id="product-images-section">
        <div className="w-auto h-[432px] aspect-[4/3] 
        flex items-center justify-center
        ">
          <ImageMagnifier image={mainImage} />
        </div>
        <div
          ref={(e) => {
            // images.current = e;
          }}
          className="flex w-[578px] overflow-x-scroll my-4 product-images relative"
        >
          {product &&
            product.images.map((item) => {
              return (
                <div
                  onMouseOver={() => {
                    setMainImage(item);
                  }}
                  className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-white hover:brightness-75 mx-"
                >
                  <img
                    className="!object-contain h-full w-full pointer-events-none"
                    src={item}
                  />
                </div>
              );
            })}
        </div>
      </section>
      <div className="flex flex-col gap-3">
        <h1 id="product-title" className="text-3xl">{product.title}</h1>
        <h1 className="text-xl">{moneyMask(product.price)}</h1>
        <h3 className="text-xl">Características</h3>
        <ul className="list-disc ml-7">
          {!!product?.features.length &&
            product?.features.map((item, index) => {
              return (
                <li key={item + index} className="text-sm mt-2">
                  {item}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
     <section className="w-[1000px]" id="product-description">
     <h1 className="text-2xl">Descrição</h1>
     <p className="whitespace-pre-line">{product.description}</p>
   </section>
   </article>
  );
};

export default ProductPage;
