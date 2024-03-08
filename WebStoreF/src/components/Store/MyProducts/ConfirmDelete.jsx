import React from "react";

const ConfirmDelete = ({ handleClick, setConfirm, loading }) => {
  return (
    <div className="fixed right-0 top-0 w-screen h-screen overflow-hidden bg-black/65 flex items-center justify-center z-20">
      <div className="bg-white px-6 py-6">
        <h3 className="mb-12 text-xl">
          Tem certeza que deseja excluir este(s) produto(s)?
        </h3>
        <div className="flex justify-between">
          <button
            disabled={loading}
            onClick={handleClick}
            className="bg-red-500 text-white px-4 hover:brightness-90"
          >
            {loading ? <span className="loader-2"></span> : `Excluir`}
          </button>
          <button
            onClick={() => {
              setConfirm(false);
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

export default ConfirmDelete;
