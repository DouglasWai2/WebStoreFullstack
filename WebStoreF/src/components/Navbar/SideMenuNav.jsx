import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogOut } from "../../hooks/useLogOut";
import Delayed from "../Cart/Delayed";
import {
  faBarcode,
  faHouse,
  faPlus,
  faPowerOff,
  faShop,
  faSquarePlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideMenuNav = ({ user, setToggleCard }) => {
  const navigate = useNavigate();
  const logOut = useLogOut();

  return (
    <div
      className="h-screen text-black 
    w-1/2 bg-white fixed right-0 z-50 py-10 
    animate-appear top-0 md:hidden max-sm:w-4/5"
    >
      <h1 className="text-2xl mb-12 px-3">
        Olá, {user ? user.name : "faça login"}
      </h1>
      <Delayed>
        {user ? (
          // if user is logged in, render this
          <>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "group actived" : "")}
            >
              <p className="px-2 py-2 rounded-md animate-appear sidenav">
                <FontAwesomeIcon className="mr-2" icon={faHouse} />
                Início
              </p>
            </NavLink>
            <div className="flex flex-col gap-3 h-screen animate-appear mt-6">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xl px-4 animate-appear sidenav">
                    Seu perfil
                  </p>
                  <NavLink
                    to="/user/profile"
                    className={({ isActive }) =>
                      isActive ? "group actived" : ""
                    }
                  >
                    <p className="px-2 py-2 animate-appear sidenav">
                      <FontAwesomeIcon className="mr-2" icon={faUser} />
                      Meu cadastro
                    </p>
                  </NavLink>
                </div>

                <div className="">
                  <p className="text-xl px-4">Sua loja</p>

                  <NavLink
                    to="/store/my-store"
                    className={({ isActive }) =>
                      isActive ? "group actived" : ""
                    }
                  >
                    <p className="px-2 py-2 animate-appear sidenav">
                      <FontAwesomeIcon className="mr-2" icon={faShop} />
                      Minha loja
                    </p>
                  </NavLink>

                  <NavLink
                    to="/store/new-product"
                    className={({ isActive }) =>
                      isActive ? "group actived" : ""
                    }
                  >
                    <p className="px-3 py-2 animate-appear sidenav">
                      <FontAwesomeIcon className="mr-2" icon={faPlus} />
                      Cadastrar produtos
                    </p>
                  </NavLink>

                  <NavLink
                    to="/store/my-products"
                    className={({ isActive }) =>
                      isActive ? "group actived" : ""
                    }
                  >
                    <p className="px-3 py-2 animate-appear sidenav">
                      <FontAwesomeIcon className="mr-2" icon={faBarcode} />
                      Meus produtos
                    </p>
                  </NavLink>
                </div>
              </div>
              <NavLink onClick={() => logOut()}>
                <p className="px-3 py-2 animate-appear bg-red-100 text-red-800 mt-6">
                  <FontAwesomeIcon className="mr-2" icon={faPowerOff} />
                  Sair
                </p>
              </NavLink>
            </div>
          </>
        ) : (
          // if user is not logged in, render this
          <div className="flex flex-col gap-3">
            <a
              href="/login"
              className="bg-yellow-400 w-full
              rounded-md py-2 cursor-pointer text-black text-center 
              hover:bg-yellow-600 transition-colors duration-200"
            >
              Faça login
            </a>
            <a
              href="/signup"
              className="text-center w-full cursor-pointer hover:underline"
            >
              Não possui conta? Cadastre-se
            </a>
          </div>
        )}
      </Delayed>
    </div>
  );
};

export default SideMenuNav;
