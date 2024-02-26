import React from "react";
import icon from "../assets/dbError.png";

const UnexpectedError = ({error}) => {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen">
      <img src={icon} />
      <div className="text-5xl">UnexpectedError</div>
      <div className="mt-6">
        Ocorreu um error inesperado na comunicação com a base de dados.{" "}
      </div>
      <div>Por favor, aguarde alguns minutos e tente novamente.</div>
      <div>ERR: {error}</div>
    </main>
  );
};

export default UnexpectedError;
