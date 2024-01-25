import React from "react";

const Menu = () => {
  return (
    <div className="absolute bg-white shadow-md right-0 px-3 py-5 flex flex-col gap-2 animate-appear">
      <button className="text-left rounded-sm bg-[#9dbbae] px-3 py-1 hover:underline">Excluir selecionados</button>
      <button className="text-left rounded-sm bg-[#9dbbae] px-3 py-1 hover:underline">
        Aplicar desconto em selecionados
      </button>
    </div>
  );
};

export default Menu;
