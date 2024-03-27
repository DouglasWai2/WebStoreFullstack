import React from "react";
import { Rating } from "react-simple-star-rating";
import { moneyMask } from "../../helpers/moneyMask";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./UI/AddToCartButton";

const ProductCard = ({ item, className, setToggleCart }) => {
  const navigate = useNavigate();

  return (
    <article
      id="product-card"
      className="max-w-[250px] flex flex-col 
      justify-between py-5 bg-white px-5 shadow-md 
      max-sm:shadow-sm
      cursor-pointer duration-200 max-sm:!w-[179px] max-sm:px-2 flex-shrink-0 "
      
      onClick={() => {
        navigate("/catalog/" + item.title.replace("/", "%2F") + "/" + item._id);
      }}
    >
      <img
        className="aspect-[4/3] h-[200px] object-contain max-sm:h-[150px]"
        src={item.thumbnail}
      />

      <div className="mt-3 hover:text-yellow-500 duration-100">
        <legend
          className="truncate text-wrap
        min-h-[4.5em] line-clamp-3 max-sm:text-sm"
        >
          {item.title}
        </legend>
      </div>
      <div className="flex items-center justify-between">
        <Rating
          size={window.innerWidth < 640 ? 15 : 25}
          readonly={true}
          initialValue={item.rating}
          allowFraction={true}
          emptyColor="rgb(209 213 219)"
          fillColor="#facc15"
        />
        <span className="text-xs">({item.rating})</span>
      </div>
      <span className="text-sm">{item.sells} vendidos</span>
      <div className="font-semibold h-[50px] text-lg mt-2 max-sm:text-sm">
        <div className="relative flex justify-end gap-1">
          {item.discount > 0 && (
            <p className="text-lg text-[#188fa7] text-nowrap justify-self-start">
              {item.discount * 100}% OFF
            </p>
          )}
          <div className="w-max">
            {item.discount > 0 && (
              <p className="text-xs w-fit font-normal strikethrough">
                {moneyMask(item.price)}
              </p>
            )}
            <p className="w-max">
              {moneyMask(
                Number(item.price - item.price * item.discount).toFixed(2)
              )}
            </p>
          </div>
        </div>
      </div>
      <AddToCartButton hidden setToggleCart={setToggleCart} product={item} />
    </article>
  );
};

export default ProductCard;
