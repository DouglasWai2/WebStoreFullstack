import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useNavigate, useParams } from "react-router-dom";
import ImageMagnifier from "../../components/Store/ImageMagnifier";
import { moneyMask } from "../../helpers/moneyMask";
import { Rating } from "react-simple-star-rating";
import api from "../../helpers/api";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate()
  const [mainImage, setMainImage] = useState("");
  const {
    data: product,
    loading,
    error,
  } = useFetchApi("/catalog/" + productId, "GET");

  useEffect(() => {
    if (product) setMainImage(product.thumbnail);
  }, [product]);

  function getPaymentIntent(productId) {
    api
      .get(process.env.REACT_APP_API_URL + "/payment_intents/" + productId)
      .then((response) => navigate(`/checkout/${product.title}/${product._id}/${response.data.client_secret}`));
  }

  return (
    product && (
      <div className="p-16 flex justify-center ">
        <article className="shadow-md w-min p-6">
          <div className="flex py-5">
            <section id="product-images-section">
              <div className="w-auto h-[432px] aspect-[4/3] flex items-center justify-center">
                <ImageMagnifier image={mainImage} />
              </div>
              <div className="flex w-[578px] overflow-x-scroll my-4 product-images relative">
                {product.images.map((item, index) => {
                  return (
                    <div
                      key={index}
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
            <section className="w-max flex flex-col gap-3">
              <h1 className="text-3xl">{product.title}</h1>
              <div className="flex justify-between items-center">
                <h3 className="text-xl">{moneyMask(product.price)}</h3>
                <p className="text-gray-600">{product.sells} vendidos</p>
              </div>
              <div className="flex gap-2 items-center">
                <Rating readonly initialValue={product.rating} />
                <span>({product.rating})</span>
              </div>
              <h3 className="text-xl">Características</h3>
              <div className="flex flex-col justify-between h-full">
                <ul className="list-disc ml-7">
                  {product.features.map((item, index) => {
                    return (
                      <li key={item + index} className="text-sm mt-2">
                        {item}
                      </li>
                    );
                  })}
                </ul>
                <div className="flex justify-end px-4">
                  <div className="flex flex-col gap-2 items-center w-1/2">
                    <button
                      onClick={() => getPaymentIntent(product._id)}
                      className="bg-[#188fa7] w-full px-16 py-2 text-lg
                                    rounded-md text-white shadow 
                                    hover:brightness-75
                                    active:shadow-none active:text-black
                                    duration-100"
                    >
                      Comprar
                    </button>
                    <button className="px-6 bg-[#ade6f1] w-full rounded-md hover:brightness-95">
                      adicionar ao carrinho
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <section className="w-[auto]" id="Product-description">
            <div className="text-left">
              <h1 className="text-2xl">Descrição</h1>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </section>
        </article>
      </div>
    )
  );
};

export default ProductPage;
