import Logo from "../../logo-no-background.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCaretDown,
  faCartShopping,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useLogOut } from "../../hooks/useLogOut";
import SkeletonNavAddress from "../shared/SkeletonNavAddress";
import NavCardMenu from "./NavCardMenu";

const Navbar = ({
  user,
  address,
  fetchingAddress,
  toggleCard,
  setToggleCard,
  setToggleCart,
}) => {
  const logOut = useLogOut();
  const [yourAddress, setYourAddress] = useState([]);

  var cart = JSON.parse(localStorage.getItem("cart"));

  useEffect(() => {
    if (address) {
      setYourAddress(address.filter((item) => item.main));
    }
  }, [address]);

  return (
    <header>
      <nav>
        <div
          className={
            "w-screen h-[9vh] bg-[#152128] py-2 px-4 flex items-center justify-between text-white"
          }
        >
          <a href="/">
            <img className="h-[50px]" alt="logo" src={Logo} />
          </a>
          <div className="flex items-center gap-2 cursor-pointer hover-border p-2 text-[10pt] w-fit">
            {fetchingAddress ? (
              <SkeletonNavAddress />
            ) : (
              <>
                <FontAwesomeIcon icon={faTruck} style={{ color: "#94989e" }} />
                <p className="flex flex-col items-start w-full text-[#94989e]">
                  {!yourAddress.length ? (
                    <>
                      Olá,{" "}
                      <span className="text-white w-max">selecione seu endereço</span>
                    </>
                  ) : (
                    <>
                      Entregar para:
                      <span className="text-white text-xs w-max">
                        {" "}
                        {yourAddress[0].recieverName.split(" ")[0]} em{" "}
                        {yourAddress[0].street} - N° {yourAddress[0].number}{" "}
                        <br></br> CEP: {yourAddress[0].cep}
                      </span>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
          <div className="w-full rounded-md overflow-hidden h-9 flex">
            <input className="w-full" />
            <button className="w-[40px] h-full bg-orange-300 hover:bg-orange-400 transition-colors duration-200">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ color: "#152128" }}
              />
            </button>
          </div>
          <div className="flex items-center gap-1 relative min-w-[150px]">
            <div
              onClick={() => {
                setToggleCard(true);
              }}
              className="flex hover-border p-2 items-center justify-around cursor-pointer w-full"
            >
              <img />

              {<p>Olá, {user ? user.name : "Faça login"} </p>}
              <FontAwesomeIcon
                icon={faCaretDown}
                style={{ color: "#94989e" }}
              />
            </div>
            {toggleCard && (
              <NavCardMenu user={user} setToggleCard={setToggleCard} />
            )}
          </div>
          <div
            onClick={() => {
              setToggleCart(true);
            }}
            className="cursor-pointer flex items-center p-2 hover-border min-w-[150px] justify-around"
          >
            <p>Seu carrinho </p>
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "#94989e" }}
            />
            <span>{cart.length}</span>
          </div>
        </div>
      </nav>
      {user && user.confirmedEmail && (
        <h3 className="text-xl font-bold bg-yellow-100 px-8">
          Enviamos um link de verificação para seu e-mail. Por favor, verifique
          sua caixa de entrada.
        </h3>
      )}
    </header>
  );
};

export default Navbar;
