import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogOut } from "../../hooks/useLogOut";
import Delayed from "../Cart/Delayed";
import close from "../../assets/closepane.png";
import {
  faArrowRight,
  faBarcode,
  faChevronRight,
  faHouse,
  faPlus,
  faPowerOff,
  faShop,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBarItem from "./NavBarItem";

const SideMenuNav = ({ user, setToggleSideNav }) => {
  const navigate = useNavigate();
  const logOut = useLogOut();

  return (
    <div
      className="h-screen text-black 
    w-1/2 bg-white fixed right-0 z-50 py-14 text-xl flex flex-col items-center
    animate-appear top-0 md:hidden max-sm:w-4/5"
    >
      <div
        onClick={() => setToggleSideNav(false)}
        className="absolute left-2 top-2 text-2xl rounded-full p-2 duration-300 active:bg-gray-200"
      >
        <img className="" src={close} />
      </div>
      <h1 className="text-2xl mb-12 px-3">
        Olá, {user ? user.name : "faça login"}
      </h1>
      <Delayed>
        {user ? (
          // if user is logged in, render this
          <>
            <NavBarItem
              onClick={() => setToggleSideNav(false)}
              to="/"
              icon={faHouse}
              text="Início"
            />
            <div className="flex flex-col gap-3 w-full animate-appear mt-6">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xl px-4 animate-appear sidenav">
                    Seu perfil
                  </p>
                  <NavBarItem
                    onClick={() => setToggleSideNav(false)}
                    to="/user/profile"
                    icon={faUser}
                    text="Meu cadastro"
                  />
                </div>

                <div className="">
                  <p className="text-xl px-4">Sua loja</p>
                  {user?.role === "Seller" ? (
                    <>
                      <NavBarItem
                        onClick={() => setToggleSideNav(false)}
                        to="/store/my-store"
                        icon={faShop}
                        text="Minha loja"
                      />
                      <NavBarItem
                        onClick={() => setToggleSideNav(false)}
                        to="/store/new-product"
                        icon={faPlus}
                        text="Cadastrar produtos"
                      />
                      <NavBarItem
                        onClick={() => setToggleSideNav(false)}
                        to="/store/my-products"
                        icon={faBarcode}
                        text="Meus produtos"
                      />
                    </>
                  ) : (
                    <NavBarItem
                      onClick={() => setToggleSideNav(false)}
                      to="/store"
                      icon={faShop}
                      text="Venda seus produtos"
                    />
                  )}
                </div>
              </div>
            </div>
            <NavLink onClick={() => logOut()}>
              <p className="px-3 py-2 animate-appear bg-red-100 text-red-800 mt-6">
                <FontAwesomeIcon className="mr-2" icon={faPowerOff} />
                Sair
              </p>
            </NavLink>
          </>
        ) : (
          // if user is not logged in, render this
          <div className="flex flex-col gap-3 mx-3">
            <a
              href="/login"
              className="bg-yellow-400 w-full
              rounded-md py-2 cursor-pointer text-black text-center 
              hover:bg-yellow-600 transition-colors duration-200 active:brightness-110"
            >
              Faça login <FontAwesomeIcon className="" icon={faArrowRight} />
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
