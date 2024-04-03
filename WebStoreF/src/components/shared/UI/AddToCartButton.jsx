import React from "react";
import { useCart } from "../../../hooks/useCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const AddToCartButton = ({ product, setToggleCart, hidden, loggedIn, disabled }) => {
  const { addToCart } = useCart(loggedIn);

  return (
    <button
    disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        addToCart(product);
        setToggleCart(true);
      }}
      className="bg-[#ade6f1] flex-shrink-0 text-center w-full h-[30px] rounded-md hover:brightness-95"
    >
      <FontAwesomeIcon icon={faCartPlus} />{" "}
      <span className={hidden && "max-sm:hidden"}>Adicionar ao carrinho</span>
    </button>
  );
};

export default AddToCartButton;
