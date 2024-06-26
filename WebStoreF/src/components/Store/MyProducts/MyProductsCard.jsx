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
import { useNavigate } from "react-router-dom";
import ConfirmBox from "../../shared/UI/ConfirmBox";

const MyProductsCard = ({ item, checked, handleCheck, refresh }) => {
  const navigate = useNavigate();
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
  useEffect(() => {
    if (confirm) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [confirm]);

  return (
    <>
      {confirm && (
        <ConfirmBox
          handleCancel={() => setConfirm(false)}
          text={"Tem certeza que deseja excluir este(s) produto(s)?"}
          buttonColor={"bg-red-500"}
          buttonText={"Excluir"}
          loading={submiting}
        />
      )}
      <div
        onClick={() =>
          navigate(`/catalog/${item.title.replace(" ", "%2F")}/${item._id}`)
        }
        className="shadow flex w-full bg-white justify-between py-3 px-2 my-3 gap-2 
      hover:brightness-80 duration-400 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <input
            id={"item_" + item._id}
            type="checkbox"
            checked={checked.includes(item._id)}
            value={item._id}
            onClick={(e) => {
              e.stopPropagation();
              handleCheck(e.target.value);
            }}
            onChange={(e) => {
              e.stopPropagation();
            }}
          />
          <div className="h-[100px] aspect-[4/3] px-3 max-sm:h-[60px]">
            <img className="object-contain h-full" src={item.thumbnail} />
          </div>
          <div className="w-full">
            <h1 className="w-full max-sm:text-sm">{item.title}</h1>
            <Rating
              size={25}
              readonly={true}
              initialValue={item.rating}
              allowFraction={true}
              emptyColor="rgb(209 213 219)"
              fillColor="#facc15"
            />
            <p>{item.sells} Vendidos</p>
            <p>{item.sellsToday} Vendidos hoje</p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-end text-nowrap max-sm:flex-col max-sm:items-start">
            {discount && (
              <label htmlFor="discount" className="mr-4 max-sm:mr-1">
                <input
                  value={discountValue}
                  onChange={(e) => {
                    e.stopPropagation();
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
                <p className="strikethrough text-xs text-center w-fit">
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
          <div className="flex gap-4 justify-end max-sm:flex-col max-sm:items-center">
            {discount ? (
              <>
                <button
                  className="hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
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
                  onClick={(e) => {
                    e.stopPropagation();
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
                  className="hover:underline rounded-md p-1 max-sm:text-wrap max-sm:w-min 
                  transition-colors duration-200 active:bg-green-300 active:text-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDiscount(true);
                  }}
                >
                  <FontAwesomeIcon className="text-xl" icon={faPercent} />
                  <span className="">Desconto</span>
                </button>
                <button
                  className="hover:underline rounded-md max-sm:text-wrap max-sm:w-min p-1 
                  transition-colors duration-200 active:bg-red-300 active:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
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
