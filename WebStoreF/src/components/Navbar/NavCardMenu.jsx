import React, { useRef } from "react";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { Link } from "react-router-dom";
import { useLogOut } from "../../hooks/useLogOut";

const NavCardMenu = ({ user, setToggleCard }) => {
  const wrapperRef = useRef(null);
  const logOut = useLogOut();
  useOutsideAlerter(wrapperRef, () => {
    setToggleCard(false);
  });

  return (
    <>
      {/* <div className="fixed right-0 top-0 w-screen h-screen overflow-hidden flex items-center justify-center z-30"> */}
      <div
        ref={wrapperRef}
        className="bg-white absolute right-[10%] top-[6%] h-fit w-[300px] p-6 flex flex-col gap-2 items-center z-30"
      >
        {user ? (
          // if user is logged in, render this
          <>
            <Link
              to="/user/profile"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Meu cadastro
            </Link>
            <Link
              to="/store"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Venda seu produto
            </Link>

            {user?.role === "Seller" && (
              <>
                <Link
                  to="/store/my-store"
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                >
                  Minha loja
                </Link>
                <Link
                  to="/store/new-product"
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                >
                  Cadastrar produtos
                </Link>
                <Link
                  to="/store/my-products"
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                >
                  Meus produtos
                </Link>
              </>
            )}
            <a
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={logOut}
            >
              Sair
            </a>
          </>
        ) : (
          // if user is not logged in, render this
          <>
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
          </>
        )}
        {/* </div> */}
      </div>
    </>
  );
};

export default NavCardMenu;
