import Logo from "../logo-no-background.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlass,
  faCaretDown,
  faCartShopping,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../helpers/logOut";
import { getUserAddressess } from "../helpers/getUserAddress";
import { handleError } from "../helpers/handleError";

const Navbar = () => {
  const [toggleCard, setToggleCard] = useState(false);
  const loggedIn = window.localStorage.getItem("LoggedIn");
  const name = window.localStorage.getItem("name");
  const isVerified = window.localStorage.getItem("verified");
  const [yourAddress, setYourAddress] = useState([]);

  async function getMainAddress() {
    try {
      const data = await getUserAddressess();
      const mainAddress = data.filter((item) => {
        return item.main;
      });
      setYourAddress(mainAddress);
    } catch (error) {
      handleError(error, getMainAddress);
    }
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setToggleCard(false)
          console.log(toggleCard)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    if (loggedIn === "true") {
      getMainAddress();
    }
  }, []);

  return (
    <header>
      <nav>
        <div className="w-full h-[9vh] bg-[#152128] py-2 px-4 flex items-center justify-between text-white">
          <a href="/">
            <img className="h-[35px]" alt="logo" src={Logo} />
          </a>
          <div className="flex items-center gap-2 cursor-pointer hover-border p-2 text-[10pt]">
            {yourAddress.length === 0 ? (
              <>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: "#94989e" }}
                />
                <p className="flex flex-col items-start text-[#94989e]">
                  Olá,{" "}
                  <span className="text-white">selecione seu endereço</span>
                </p>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTruck} style={{ color: "#94989e" }} />
                <p className="flex flex-col items-start text-[#94989e]">
                  Entregar para
                  <span className="text-white">
                    {" "}
                    {yourAddress[0].recieverName.split(" ")[0]} - CEP:{" "}
                    {yourAddress[0].cep}
                  </span>
                </p>
              </>
            )}
          </div>

          <div className="w-[50%] rounded-md overflow-hidden h-9 flex">
            <input className="w-full" />
            <button className="w-[40px] h-full bg-orange-300 hover:bg-orange-400 transition-colors duration-200">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ color: "#152128" }}
              />
            </button>
          </div>
          <div className="flex items-center gap-1 relative">
            <div
              onClick={() => {
                setToggleCard(true);
              }}
              className="flex hover-border p-2 items-center gap-1 cursor-pointer"
            >
              <img />
              {loggedIn === "true" ? (
                <p>Olá, {name}</p>
              ) : (
                <p>Olá, faça login</p>
              )}
              <FontAwesomeIcon
                icon={faCaretDown}
                style={{ color: "#94989e" }}
              />
            </div>
            {toggleCard ? (
              loggedIn === "true" ? (
                // if user is logged in, render this
                <div ref={wrapperRef} className="bg-white absolute bottom-[-110px] left-[-160px] h-fit w-[300px] p-6 flex flex-col gap-2 items-center">
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
                  <a onClick={logOut}>
                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                      Sair
                    </p>
                  </a>
                </div>
              ) : (
                // if user is not logged in, render this
                <div ref={wrapperRef} className="bg-white text-black absolute bottom-[-110px] left-[-160px] w-[300px] p-6 flex flex-col gap-2 items-center">
                  <a
                    href="/login"
                    className="bg-yellow-400 w-[100%] cursor-pointer text-center hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Faça login
                  </a>
                  <a href="/signup">
                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                      Não possui conta? Cadastre-se
                    </p>
                  </a>
                </div>
              )
            ) : (
              ""
            )}
          </div>
          <div className="cursor-pointer p-2 hover-border">
            Seu carrinho{" "}
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "#94989e" }}
            />
          </div>
        </div>
      </nav>
      {isVerified === "false" ? (
        <h3 className="text-xl font-bold bg-red-100">
          Enviamos um link de verificação para seu e-mail. Por favor verifique
          sua caixa de entrada.
        </h3>
      ) : (
        ""
      )}
    </header>
  );
};

export default Navbar;
