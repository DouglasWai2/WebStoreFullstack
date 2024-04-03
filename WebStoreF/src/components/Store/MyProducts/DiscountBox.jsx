import React from "react";

const DiscountBox = ({
  handleClick,
  setDiscount,
  discountValue,
  setDiscountValue,
}) => {
  return (
    <div className="fixed right-0 top-0 w-screen h-screen overflow-hidden bg-black/65 flex items-center justify-center z-50">
      <div className="bg-white max-w-[500px] w-full px-6 py-6 flex flex-col gap-6 rounded-lg shadow">
        <h3 className="text-xl">Valor do desconto</h3>
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
            className="border-b-2 border-gray-200 w-[50px]"
          />
          %
        </label>
        <div className="flex justify-between">
          <button
            onClick={handleClick}
            className="bg-green-500 text-white px-4 hover:brightness-90 rounded"
          >
            Confirmar
          </button>
          <button
            onClick={() => {
              setDiscount(false);
            }}
            className="hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountBox;
