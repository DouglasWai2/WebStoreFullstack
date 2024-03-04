import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogOut } from "../../hooks/useLogOut";

const SideMenuNav = ({ user, setToggleCard, wrapperRef }) => {
  const navigate = useNavigate()
  const logOut = useLogOut();

  return (
    <div ref={wrapperRef} className="h-screen px-6 pt-[50px] text-right text-black 
    w-1/2 bg-white fixed right-0 z-50 animate-appear top-0 md:hidden max-sm:w-2/3">
      <h1 className="text-2xl mb-12">
        Olá, {user ? user.name : "faça login"}
      </h1>
      {user ? (
        // if user is logged in, render this
        <div className="flex h-screen pb-[200px] flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col w-full gap-8">
              <div className="w-full">
                <p className="text-black text-lg font-medium">Seu perfil</p>
                <div
                  onClick={() => {
                    navigate("/user/profile"); 
                    setToggleCard(false);
                  }}
                  className="border-b-[1px] mt-2 w-full border-gray-300 cursor-pointer"
                >
                  Meu cadastro
                </div>
              </div>
              <div className="w-full">
                {" "}
                <p className="text-black text-lg font-medium">Sua loja</p>
                {user?.role === "Seller" ? (
                  <>
                    <div>
                      {" "}
                      <div
                        onClick={() =>{ 
                          navigate("/store/my-store");
                          setToggleCard(false)
                        }}
                        className="border-b-[1px] mt-2 w-full cursor-pointer hover:underline"
                      >
                        Minha loja
                      </div>
                    </div>
                    <div>
                      {" "}
                      <div
                        onClick={() => {
                          navigate("/store/new-product");
                          setToggleCard(false)
                        }}
                        className="border-b-[1px] mt-2 w-full cursor-pointer hover:underline"
                      >
                        Cadastrar produtos
                      </div>
                    </div>
                    <div>
                      {" "}
                      <div
                        onClick={() => {
                          navigate("/store/my-products");
                          setToggleCard(false)
                        }}
                        className="border-b-[1px] mt-2 w-full cursor-pointer hover:underline"
                      >
                        Meus produtos
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    {" "}
                    <div
                      onClick={() => {
                        navigate("/store");
                        setToggleCard(false)
                      }}
                      className="border-b-[1px] mt-2 w-full cursor-pointer hover:underline"
                    >
                      Venda seu produto
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full cursor-pointer bg-red-500">
            <p className="text-center rounded-sm" 
            onClick={logOut}>
              Sair
            </p>
          </div>
        </div>
      ) : (
        // if user is not logged in, render this
        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="bg-yellow-400 w-[100%] cursor-pointer text-black text-center hover:bg-yellow-600 transition-colors duration-200"
          >
            Faça login
          </a>
          <a
            href="/signup"
            className="border-b-[1px] text-center w-full cursor-pointer hover:underline"
          >
            Não possui conta? Cadastre-se
          </a>
        </div>
      )}
    </div>
  );
};

export default SideMenuNav;
