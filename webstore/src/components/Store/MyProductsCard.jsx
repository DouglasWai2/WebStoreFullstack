import React, { useState } from "react";
import { moneyMask } from "../../helpers/moneyMask";
import { Rating } from "react-simple-star-rating";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyProductsCard = ({ item, checked, handleCheck, setBody }) => {
  return (
    <div className="shadow flex justify-between py-3 px-2 my-3">
      <div className="flex">
        <input
          id={"item_" + item._id}
          type="checkbox"
          checked={checked.includes(item._id)}
          value={item._id}
          onClick={(e) => handleCheck(e.target.value)}
        />
        <div className="h-[100px] aspect-[4/3] px-3">
          <img className="object-contain h-full" src={item.thumbnail} />
        </div>
        <div>
          <h1 className="max-w-[60%]">{item.title}</h1>
          <Rating
            size={25}
            readonly={true}
            initialValue={item.rating}
            allowFraction={true}
            emptyColor="rgb(209 213 219)"
            fillColor="#facc15"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <p className="font-semibold">{moneyMask(item.price)}</p>
        <button className="hover:underline text" onClick={()=>{
            setBody({productIDs: [item._id]})
        }}>
          <FontAwesomeIcon icon={faTrashCan} />
          Excluir
        </button>
      </div>
    </div>
  );
};

export default MyProductsCard;
