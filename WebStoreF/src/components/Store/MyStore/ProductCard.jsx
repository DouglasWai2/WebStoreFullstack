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
        "w-[250px] py-5 bg-white p-3 px-5 shadow-md group cursor-pointer duration-200 max-sm:!w-[160px] max-sm:px-2 " +
        className
      }
      onClick={() => {
        console.log("/catalog/" + item.title + "/" + item._id);
        navigate("/catalog/" + item.title.replace("/", "%2F") + "/" + item._id);
      }}
    >
      <img className="aspect-[4/3] object-contain" src={item.thumbnail} />
      <div className="mt-3 group-hover:text-yellow-500 duration-100">
        <legend className="truncate text-wrap 
        min-h-[4.5em] line-clamp-3 max-sm:text-sm">
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
        {item.discount > 0 ? (
          <div className="flex gap-5 justify-between max-sm:gap-0">
            <p className="text-lg mt-1 text-[#188fa7] text-nowrap max-sm:text-sm">
              {item.discount * 100}% OFF
            </p>

            <div className="flex flex-col items-center">
              <p className="strikethrough text-xs text-center h-min w-fit">
                {moneyMask(item.price)}
              </p>
              <p className="w-max">
                {moneyMask(
                  Number(item.price - item.price * item.discount).toFixed(2)
                )}
              </p>
            </div>
          </div>
        ) : (
          moneyMask(item.price)
        )}
      </div>
    </article>
  );
};

export default ProductCard;
