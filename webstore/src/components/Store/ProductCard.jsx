import React from "react";
import { Rating } from "react-simple-star-rating";
import { moneyMask } from "../../helpers/moneyMask";

const ProductCard = ({ img, title, rating, price, sells }) => {
  return (
    <div
      id="product-card"
      className="w-[250px] h-[350px] bg-white p-3 px-5 shadow-md group cursor-pointer duration-200"
    >
      <img className="aspect-[4/3] object-contain" src={img} />
      <div className="mt-3 group-hover:text-yellow-500 duration-100">
        <p className="truncate text-wrap min-h-[4.5em] line-clamp-3">{title}</p>
      </div>
      <div className="flex items-center justify-between">
        <Rating
          size={25}
          readonly={true}
          initialValue={rating}
          allowFraction={true}
          emptyColor="rgb(209 213 219)"
          fillColor="#facc15"
        />
        <span className="text-xs">({rating})</span>
      </div>
      <span className="text-sm">{sells} vendidos</span>
      <div className="font-semibold text-lg mt-2 text-right">
        {moneyMask(price)}
      </div>
    </div>
  );
};

export default ProductCard;
