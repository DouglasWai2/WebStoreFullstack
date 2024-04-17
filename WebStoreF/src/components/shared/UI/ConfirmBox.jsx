import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const ConfirmBox = ({
  handleClick,
  handleCancel,
  loading,
  buttonColor,
  buttonText,
  discount,
  text,
  discountValue,
  setDiscountValue,
}) => {
  return (
    <div className="fixed right-0 top-0 w-screen h-screen overflow-hidden bg-black/65 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-6 rounded-lg shadow">
        <h3 className="mb-12 text-xl">{text}</h3>
        {discount && (
          <label htmlFor="discount">
            <input
              value={discountValue}
              onChange={(e) => {
                if (e.target.value > 100) return;
                setDiscountValue(e.target.value);
              }}
              id="discount"
              pattern="[0-9]{3}"
              type="number"
              className="my-5 border-b-2 border-gray-200 w-[50px]"
            />
            %
          </label>
        )}
        <div className="flex justify-between">
          <button
            disabled={loading}
            onClick={handleClick}
            className={
              "text-white flex gap-2 px-2 py-1 duration-200 transition-width hover:brightness-90 rounded " +
              buttonColor
            }
          >
            {loading && <LoadingSpinner color="white" />}
            {buttonText}
          </button>
          <button onClick={handleCancel} className="hover:underline">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
