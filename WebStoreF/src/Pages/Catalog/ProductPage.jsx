import { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ImageMagnifier from "../../components/Store/ImageMagnifier";
import { moneyMask } from "../../helpers/moneyMask";
import { Rating } from "react-simple-star-rating";
import { useApi } from "../../hooks/useApi";
import ProductPageSkeleton from "../../components/Catalog/ProductPageSkeleton";
import Logo from "../../components/Store/MyStore/Logo";
import LikeButton from "../../components/shared/UI/LikeButton";
import ShareButton from "../../components/shared/UI/ShareButton";
import {
  faAnglesDown,
  faAnglesUp,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddToCartButton from "../../components/shared/UI/AddToCartButton";
import Comment from "../../components/Catalog/ProductPage/Comment";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, setToggleCart, loggedIn } = useOutletContext();
  const [mainImage, setMainImage] = useState("");
  const [fullDescription, setFullDescription] = useState(null);
  const descriptionRef = useRef(null);
  const {
    data: product,
    loading,
    error,
  } = useFetchApi("/catalog/product/" + productId, "GET");

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("lvpIDs"))) {
      localStorage.setItem("lvpIDs", JSON.stringify([]));
    }

    var lvpIDs = JSON.parse(localStorage.getItem("lvpIDs"));
    if (!productId) return;
    if (lvpIDs.includes(productId)) return;

    lvpIDs.unshift(productId);
    if (lvpIDs.length > 5) lvpIDs.pop();
    localStorage.setItem("lvpIDs", JSON.stringify(lvpIDs));
  }, []);

  useEffect(() => {
    if (product) setMainImage(product.thumbnail);

    if (descriptionRef?.current) {
      isVisible(descriptionRef?.current);
    }
  }, [product]);

  function isVisible(parent) {
    var child = parent.children[1];

    var child_height = child.offsetHeight;
    var parent_height = parent.offsetHeight;
    if (child_height > parent_height) {
      setFullDescription(false);
    }
  }

  return loading ? (
    <ProductPageSkeleton />
  ) : (
    product && (
      <div className="w-full py-10 flex flex-col items-center gap-5 max-lg:px-6 max-sm:px-0">
        <article className="shadow-md p-6 w-full max-w-[1440px] bg-white rounded-lg">
          <div className="flex justify-between py-5 max-lg:flex-col max-lg:justify-normal">
            <section
              id="product-images-section"
              className="max-lg:flex max-lg:flex-col max-lg:items-center"
            >
              <div className="w-[578px] h-[433px] flex items-center justify-center object-contain max-md:w-full">
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
            <section className="max-w-[50%] max-lg:max-w-full w-max flex flex-col gap-3">
              <h1 className="text-3xl">{product.title}</h1>
              <div className="flex justify-between items-center">
                <div className="text-xl h-fit flex">
                  <p className="h-min relative flex flex-col">
                    {product.discount > 0 && (
                      <span className="strikethrough absolute top-0 text-sm w-fit">
                        {moneyMask(product.price)}
                      </span>
                    )}
                    <span>
                      {moneyMask(
                        (
                          product.price -
                          product.discount * product.price
                        ).toFixed(2)
                      )}
                    </span>
                  </p>
                  {product.discount > 0 && (
                    <p className="text-lg font-bold text-[#188fa7] text-nowrap justify-self-start">
                      {" "}
                      {product.discount * 100}% OFF
                    </p>
                  )}
                </div>
                <p className="text-gray-600">{product.sells} vendidos</p>
              </div>
              <div className="flex gap-2 items-center">
                <Rating allowFraction readonly initialValue={product.rating} />
                <span>({product.rating})</span>
              </div>
              <div className="flex flex-col gap-10 justify-between h-full max-lg:flex-col-reverse">
                <ul className="list-disc ml-7">
                  {product.features.length > 0 && (
                    <h3 className="text-xl">Características</h3>
                  )}
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
              </div>
            </section>
          </div>
          <section>
            <p>Vendido por:</p>
            <div className="flex justify-between items-center gap-8 max-lg:flex-col max-lg:justify-normal">
              <div
                onClick={() =>
                  navigate(
                    `/store/${product.store.storeName}/${product.store._id}`
                  )
                }
                className="flex items-center gap-3 border-2 
            bg-white border-gray-300 rounded-md p-2 px-6 
            duration-300 cursor-pointer w-1/2
            active:translate-y-0 active:shadow-none max-lg:w-full"
              >
                <Logo
                  className={"w-[70px] h-[70px] rounded-full overflow-hidden"}
                  image={product.store.storeImage}
                />
                <div>
                  <p className="text-2xl">{product.store.storeName}</p>
                  <div className="flex">
                    <ShareButton
                      storeName={product.store.storeName}
                      storeId={product.store._id}
                    />
                    <LikeButton
                      numLikes={product.store.likes}
                      storeId={product.store._id}
                      user={user?.saved_stores}
                    />
                  </div>
                  <Rating
                    readonly
                    initialValue={
                      product.store.rating.reduce((a, b) => a + b, 0) /
                      product.store.rating.length
                    }
                    allowFraction
                    fillColor={"#188fa7"}
                    size={25}
                  />
                </div>
              </div>
              <div className="min-w-[200px] w-1/2 max-lg:w-full">
                <button
                  onClick={() => navigate("/checkout/" + product._id)}
                  className="bg-[#188fa7] w-full px-2 py-2 h-[65px]
                                  rounded-md text-xl text-center text-white shadow
                                  hover:brightness-75 mb-2
                                  active:shadow-none active:text-black
                                  duration-100"
                >
                  Comprar
                </button>
                <AddToCartButton
                  loggedIn={loggedIn}
                  product={product}
                  setToggleCart={setToggleCart}
                />
              </div>
            </div>
          </section>
        </article>
        <section
          className="w-full max-w-[1440px] mt-2 px-6 py-8 bg-white rounded-lg shadow"
          id="Product-description"
        >
          <div
            ref={descriptionRef}
            className={
              "text-left max-h-[190px] duration-200 overflow-hidden " +
              (fullDescription ? "!max-h-[3000px]" : "")
            }
          >
            <h1 className="text-2xl">Descrição</h1>
            <p
              className={
                "whitespace-pre-line py-4 " +
                (fullDescription === false ? "line-clamp-5" : "")
              }
            >
              {product.description}
            </p>
          </div>
          {fullDescription !== null && (
            <div
              onClick={() => setFullDescription(!fullDescription)}
              className="relative flex items-center justify-center cursor-pointer group"
            >
              <span className="w-full border-b-[1px] border-black absolute"></span>
              <div className="absolute flex items-center gap-2 bg-white px-3">
                <span className="group-hover:underline">
                  {fullDescription ? "Mostrar menos" : "Mostrar mais"}
                </span>
                {!fullDescription && (
                  <FontAwesomeIcon
                    className="group-hover:animate-bounce"
                    icon={faAnglesDown}
                  />
                )}
                {fullDescription && (
                  <FontAwesomeIcon
                    className="group-hover:animate-bounce"
                    icon={faAnglesUp}
                  />
                )}
              </div>
            </div>
          )}
        </section>
        <section
          id="ratings"
          className="max-w-[1440px] px-6 w-full bg-white rounded-lg shadow py-4"
        >
          <h1 className="text-2xl mb-4">Avaliações</h1>
          {product.ratings.length > 0 ? (
            product.ratings.map((rating) => (
              <Comment
                name={rating.user.name + " " + rating.user.lastName}
                rating={rating.rating}
                comment={rating.comment}
                title={rating.title}
              />
            ))
          ) : (
            <p>Sem avaliações</p>
          )}
        </section>
      </div>
    )
  );
};

export default ProductPage;
