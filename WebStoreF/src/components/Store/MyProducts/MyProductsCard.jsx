import React, { useEffect, useState } from "react";
import { moneyMask } from "../../../helpers/moneyMask";
import { Rating } from "react-simple-star-rating";
import {
  faCheck,
  faPercent,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchApi } from "../../../hooks/useFetchApi";
import ConfirmDelete from "./ConfirmDelete";

const MyProductsCard = ({ item, checked, handleCheck, refresh }) => {
  const [body, setBody] = useState(null);
  const [url, setUrl] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState(item.discount * 100);

  const {
    data: response,
    loading: submiting,
    error: invalid,
  } = useFetchApi(url, "POST", body);

  useEffect(() => {
    if (response) {
      refresh();
    }

    if (submiting === false) {
      setDiscount(false);
    }
  }, [response, submiting]);

  function handleClick() {
    setBody({ productIDs: [item._id] });
    setUrl("/store/my-store/delete-products");
  }

  return (
    <>
      {confirm && (
        <ConfirmDelete handleClick={handleClick} setConfirm={setConfirm} />
      )}
      <div className="shadow flex bg-white justify-between py-3 px-2 my-3 gap-2 
      hover:brightness-80 duration-400 min-w-[400px]">
        <div className="flex items-center">
          <input
            id={"item_" + item._id}
            type="checkbox"
            checked={checked.includes(item._id)}
            value={item._id}
            onClick={(e) => handleCheck(e.target.value)}
            onChange={(e) => {}}
          />
          <div className="h-[100px] aspect-[4/3] px-3 max-sm:h-[60px]">
            <img className="object-contain h-full" src={item.thumbnail} />
          </div>
          <div className="max-w-[750px]">
            <h1 className="w-full max-sm:text-sm">{item.title}</h1>
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
          <div className="flex justify-end text-nowrap">
            {discount && (
              <label htmlFor="discount" className="mr-4 max-sm:mr-1">
                <input
                  value={discountValue}
                  onChange={(e) => {
                    if (e.target.value > 100) return;
                    setDiscountValue(e.target.value);
                  }}
                  id="discount"
                  pattern="[0-9]{3}"
                  type="number"
                  className="border-b-2 border-gray-200 w-[50px]"
                />
                %
              </label>
            )}
            {!discount && item.discount > 0 && (
              <p className="mr-2 text-gray-500 text-end">
                {discountValue}% OFF
              </p>
            )}
            <div>
              {item.discount > 0 && (
                <p className="strikethrough text-xs text-center">
                  {moneyMask(item.price)}
                </p>
              )}
              <p className="font-semibold text-right ">
                {moneyMask(
                  item.discount
                    ? Number(item.price - item.price * item.discount).toFixed(2)
                    : item.price
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            {discount ? (
              <>
                <button
                  className="hover:underline"
                  onClick={() => {
                    setUrl("/store/my-store/discount-products");
                    setBody({
                      productIDs: [item._id],
                      discount: discountValue / 100,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Confirmar
                </button>
                <button
                  className="hover:underline text-red-600"
                  onClick={() => {
                    setDiscount(false);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  className="hover:underline rounded-md p-1 text transition-colors duration-200 active:bg-green-300 active:text-green-600"
                  onClick={() => {
                    setDiscount(true);
                  }}
                >
                  <FontAwesomeIcon className="text-xl" icon={faPercent} />
                  <span className="">Desconto</span>
                </button>
                <button
                  className="hover:underline rounded-md text p-1 transition-colors duration-200 active:bg-red-300 active:text-red-600"
                  onClick={() => {
                    setConfirm(true);
                  }}
                >
                  <FontAwesomeIcon className="text-xl" icon={faTrashCan} />
                  <span className="">Excluir</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProductsCard;
