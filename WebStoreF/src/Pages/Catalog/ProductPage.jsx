import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useNavigate, useParams } from "react-router-dom";
import ImageMagnifier from "../../components/Store/ImageMagnifier";
import { moneyMask } from "../../helpers/moneyMask";
import { Rating } from "react-simple-star-rating";
import { useApi } from "../../hooks/useApi";
import { addToCart } from "../../helpers/addToCart";

const ProductPage = () => {
  const api = useApi();
  const { productId } = useParams();
  const navigate = useNavigate();
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
      .get(import.meta.env.VITE_API_URL + "/payment_intents/" + productId)
      .then((response) =>
        navigate(
          `/checkout/${product.title}/${product._id}/${response.data.client_secret}`
        )
      );
  }

  return (
    product && (
      <div className="w-screen py-10 flex flex-col items-center gap-5 max-lg:px-6">
        <article className="shadow-md p-6 w-full max-w-[1440px]">
          <div className="flex justify-between gap-5 py-5 max-lg:flex-col max-lg:justify-normal">
            <section
              id="product-images-section"
              className="max-lg:flex max-lg:flex-col max-lg:items-center"
            >
              <div className="!w-[578px] h-[433px] flex items-center justify-center object-contain">
                <ImageMagnifier image={mainImage} />
              </div>
              <div className="flex w-[578px] overflow-x-scroll my-4 product-images relative max-lg:w-full">
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
            <section className="w-[50%] max-lg:w-full flex flex-col gap-3">
              <h1 className="text-3xl">{product.title}</h1>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-lg mt-2 text-right">
                  {product.discount > 0 ? (
                    <div className="flex flex-row-reverse gap-3">
                      <p className="text-2xl text-[#188fa7] text-end">
                        {product.discount * 100}% OFF
                      </p>

                      <div className="text-end">
                        <p className="strikethrough text-xs text-center h-min w-fit">
                          {moneyMask(product.price)}
                        </p>
                        <p className="text-xl">
                          {moneyMask(
                            Number(
                              product.price - product.price * product.discount
                            ).toFixed(2)
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-xl">{moneyMask(product.price)}</h3>
                  )}
                </div>
                <p className="text-gray-600">{product.sells} vendidos</p>
              </div>
              <div className="flex gap-2 items-center">
                <Rating readonly initialValue={product.rating} />
                <span>({product.rating})</span>
              </div>
              <div className="flex flex-col gap-10 justify-between h-full max-lg:flex-col-reverse">
                <ul className="list-disc ml-7">
                  <h3 className="text-xl">Características</h3>
                  {product.features.map((item, index) => {
                    return (
                      <li
                        key={item + index}
                        className="text-sm mt-2 max-lg:text-lg"
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
                <div className="w-full min-w-[200px]">
                  <button
                    onClick={() => getPaymentIntent(product._id)}
                    className="bg-[#188fa7] w-full px-2 py-2 mb-2 text-lg
                                    rounded-md text-center text-white shadow 
                                    hover:brightness-75
                                    active:shadow-none active:text-black
                                    duration-100"
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => {
                      addToCart(
                        product._id,
                        product.price,
                        product.discount,
                        product.title,
                        product.thumbnail
                      );
                    }}
                    className="px-6 bg-[#ade6f1] text-center w-full rounded-md hover:brightness-95"
                  >
                    adicionar ao carrinho
                  </button>
                </div>
              </div>
            </section>
          </div>
          <section className="w-[auto] mt-8" id="Product-description">
            <div className="text-left">
              <h1 className="text-2xl">Descrição</h1>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </section>
        </article>
        <section id="ratings" className="max-w-[1440px]">
          <h1 className="text-2xl mb-4">Avaliações</h1>

          <div className="border-b-[1px] border-slate-200 py-3 w-full">
            <div className="flex items-center gap-2">
              <p className="font-semibold">Augusto Silva</p>
              <Rating size={30} />
            </div>

            <p className="relative w-full pl-12 before:border-b-2 before:border-l-2 before:absolute before:border-gray-400 before:w-3 before:h-1/2 before:left-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              pulvinar tellus enim, ut aliquet arcu finibus sit amet. Sed quis
              lacus nulla. Vestibulum a dolor sed nunc varius tempor. Etiam quis
              sapien quis sem commodo aliquet. Donec augue sem, tempor vel
              auctor sed, lacinia a ante. Curabitur vehicula auctor feugiat.
              Mauris aliquet lacus enim, a elementum ex pellentesque sit amet.
              Fusce volutpat diam sit amet elementum laoreet. Etiam lacinia
              risus vel metus feugiat placerat. Nullam sed lacus vel odio
              ullamcorper facilisis sit amet a sapien. Nam feugiat volutpat
              metus, eget laoreet nulla sagittis eget. Duis at ornare massa. Nam
              augue odio, tristique vel nibh dignissim, malesuada maximus diam.
              Mauris placerat ante nec massa fringilla, at placerat sem
              porttitor. Nullam rutrum, odio id porta aliquet, mauris quam
              lacinia quam, et rhoncus nulla leo eu dolor.
            </p>
          </div>
        </section>
      </div>
    )
  );
};

export default ProductPage;
