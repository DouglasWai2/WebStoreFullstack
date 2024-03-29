import React, { useRef } from "react";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { Link } from "react-router-dom";
import { useLogOut } from "../../hooks/useLogOut";

const NavCardMenu = ({ user, setToggleCard, wrapperRef }) => {
  const logOut = useLogOut();
  


  return (
    <>
      <div
        ref={wrapperRef}
        className="
        bg-white absolute right-0 top-[100%] h-fit p-6 z-30 max-md:hidden"
      >
        {user ? (
          // if user is logged in, render this

          <div
            className="w-max pl-20
          flex flex-col gap-2 items-center"
          >
            <div className="flex flex-col w-full gap-4 text-right">
              <div className="w-full border-r-[1px] border-gray-600 pr-4">
                <p className="text-black">Seu perfil</p>
                <Link
                  onClick={() => setToggleCard(false)}
                  to="/user/profile"
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                >
                  Meu cadastro
                </Link>
              </div>
              <div className="border-r-[1px] border-gray-600 pr-4 w-full">
                {" "}
                <p className="text-black">Sua loja</p>
                {user?.role === "Seller" ? (
                  <>
                    <div>
                      {" "}
                      <Link
                        onClick={() => setToggleCard(false)}
                        to="/store/my-store"
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                      >
                        Minha loja
                      </Link>
                    </div>
                    <div>
                      {" "}
                      <Link
                        onClick={() => setToggleCard(false)}
                        to="/store/new-product"
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                      >
                        Cadastrar produtos
                      </Link>
                    </div>
                    <div>
                      {" "}
                      <Link
                        onClick={() => setToggleCard(false)}
                        to="/store/my-products"
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                      >
                        Meus produtos
                      </Link>
                    </div>
                    <div>
                      {" "}
                      <Link
                        onClick={() => setToggleCard(false)}
                        to="/store/my-store/orders"
                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                      >
                        Pedidos
                      </Link>
                    </div>
                  </>
                ) : (
                  <div>
                    {" "}
                    <Link
                      onClick={() => setToggleCard(false)}
                      to="/store"
                      className="text-sm text-blue-600 cursor-pointer hover:underline"
                    >
                      Venda seu produto
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <a
              className="text-sm mt-4 text-blue-600 cursor-pointer hover:underline"
              onClick={logOut}
            >
              Sair
            </a>
          </div>
        ) : (
          // if user is not logged in, render this
          <div className="w-max flex flex-col gap-3">
            <a
              href="/login"
              className="bg-yellow-400 w-[100%] cursor-pointer text-black text-center hover:bg-yellow-600 transition-colors duration-200"
            >
              Faça login
            </a>
            <a
              href="/signup"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Não possui conta? Cadastre-se
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default NavCardMenu;
