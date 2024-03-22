import React from "react";
import { Rating } from "react-simple-star-rating";
import { moneyMask } from "../../../helpers/moneyMask";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item, className }) => {
  const navigate = useNavigate();

  return (
    <article
      id="product-card"
      className={
        "max-w-[250px] max-h-[380px] h-full flex flex-col py-5 bg-white px-5 shadow-md group cursor-pointer duration-200 max-sm:!w-[160px] max-sm:px-2 flex-shrink-0 " +
        className
      }
      onClick={() => {
        navigate("/catalog/" + item.title.replace("/", "%2F") + "/" + item._id);
      }}
    >
      <img
        className="aspect-[4/3] max-h-[200px] h-full object-contain"
        src={item.thumbnail}
      />

      <div className="mt-3 group-hover:text-yellow-500 duration-100">
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
      <div className="font-semibold text-lg mt-2 text-right max-sm:text-sm">
        <div className={"flex justify-end max-sm:gap-0 " + (item.discount > 0 && "!justify-between")}>
          {item.discount > 0 && (
            <p className="text-lg mt-1 text-[#188fa7] text-nowrap">
              {item.discount * 100}% OFF
            </p>
          )}
          <div>
            {item.discount > 0 && (
              <p className="strikethrough text-xs text-center font-normal h-min w-fit text-gray-800">
                {moneyMask(item.price)}
              </p>
            )}
            <p className="w-max ">
              {moneyMask(
                Number(item.price - item.price * item.discount).toFixed(2)
              )}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
