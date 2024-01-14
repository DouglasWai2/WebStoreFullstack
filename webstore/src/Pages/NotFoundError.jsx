import React from "react";
import { useNavigate } from "react-router-dom";
import icon from '../assets/2099077-200.png'

const NotFoundError = () => {
    const navigate = useNavigate()
  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen">
        <img src={icon} />
      <div className="text-6xl">404 Not Found</div>
      <div className="">A página que você procura não existe</div>
      <div onClick={()=> {
        navigate('/', {replace: true})
      }} className="font-medium mt-3 hover:underline cursor-pointer">Volte à página principal aqui.</div>
    </main>
  );
};

export default NotFoundError;
