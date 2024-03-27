import Logo from "../../assets/logo-no-background.svg";
import Logo2 from "../../assets/webstore-favicon-color.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCartShopping,
  faTruck,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import SkeletonNavAddress from "./SkeletonNavAddress";
import NavCardMenu from "./NavCardMenu";
import SearchInput from "./SearchInput";
import SideMenuNav from "./SideMenuNav";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({
  user,
  address,
  fetchingAddress,
  toggleCard,
  setToggleCard,
  setToggleCart,
  setToggleSideNav,
  toggleSideNav,
}) => {
  const [cartItemsNum, setCartItemsNum] = useState(
    JSON.parse(localStorage.getItem("cart"))?.length
  );

  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  const sideBarRef = useRef(null);

  useOutsideAlerter(wrapperRef, () => {
    setToggleCard(false);
  });
  useOutsideAlerter(sideBarRef, () => {
    setToggleSideNav(false);
  });

  const [yourAddress, setYourAddress] = useState([]);

  useEffect(() => {
    const handleStorage = () => {
      setCartItemsNum(JSON.parse(localStorage.getItem("cart"))?.length);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
            "w-full h-[80px] bg-[#152128] py-1 px-2 flex items-center justify-between gap-2 text-white"
          }
        >
          <Link to="/">
            <img
              className="h-[50px] max-md:h-[80px]"
              alt="logo"
              src={window.innerWidth < 768 ? Logo2 : Logo}
            />
          </Link>
          <div
            onClick={() => {
              navigate("/user/address");
            }}
            className="flex items-center gap-2 cursor-pointer hover-border p-2 text-[10pt] w-fit max-md:hidden"
          >
            {fetchingAddress ? (
              <SkeletonNavAddress />
            ) : (
              <>
                <FontAwesomeIcon icon={faTruck} style={{ color: "#94989e" }} />
                <p className="flex flex-col items-start w-full text-[#94989e]">
                  {!yourAddress.length ? (
                    <>
                      Olá,{" "}
                      <span className="text-white w-max">
                        selecione seu endereço
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="max-lg:!hidden">Entregar para:</span>
                      <span
                        className="text-white text-xs 
                      w-max max-xl:w-fit max-lg:!hidden"
                      >
                        {" "}
                        {yourAddress[0].recieverName.split(" ")[0]} em{" "}
                        {yourAddress[0].street} - N° {yourAddress[0].number}{" "}
                      </span>
                      <span className="w-max max-lg:text-white">
                        CEP: {yourAddress[0].cep}
                      </span>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
          <SearchInput />
          <div className="flex items-center gap-1 relative min-w-[150px] max-md:hidden">
            <div
              onClick={() => {
                setToggleCard(true);
              }}
              className="flex hover-border p-2 items-center justify-around cursor-pointer w-full"
            >
              <img />

              {
                <p className={toggleCard ? "z-50" : "z-0"}>
                  Olá, {user ? user.name : "Faça login"}{" "}
                </p>
              }
              <FontAwesomeIcon
                icon={faCaretDown}
                style={{ color: "#94989e" }}
                className={toggleCard ? "z-50" : "z-0"}
              />
            </div>
            {toggleCard && (
              <NavCardMenu
                wrapperRef={wrapperRef}
                user={user}
                setToggleCard={setToggleCard}
              />
            )}
          </div>
          <div ref={sideBarRef} className="flex">
            <div className="items-center w-fit hidden max-md:flex">
              <div
                onClick={() => setToggleSideNav(true)}
                className="hover-border p-2 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faBars}
                  style={{ color: "#94989e" }}
                  size="xl"
                />
              </div>
              {toggleSideNav && (
                <SideMenuNav setToggleSideNav={setToggleSideNav} user={user} />
              )}
            </div>
            <div
              onClick={() => {
                setToggleCart(true);
              }}
              className="cursor-pointer relative flex items-center p-2 hover-border min-w-[150px] justify-around max-md:min-w-fit max-md:justify-center"
            >
              <p className="max-md:hidden">Seu carrinho </p>
              <FontAwesomeIcon
                icon={faCartShopping}
                size="xl"
                style={{ color: "#94989e" }}
              />
              {cartItemsNum > 0 && (
                <span
                  className="absolute top-0 right-0
               text-white bg-red-500 grid place-items-center rounded-full
                w-[20px] h-[20px] text-xs"
                >
                  {cartItemsNum}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>
      {user && !user.confirmedEmail && (
        <h3 className="text-xl font-bold bg-yellow-100 px-8 max-md:text-base max-sm:text-sm">
          Enviamos um link de verificação para seu e-mail. Por favor, verifique
          sua caixa de entrada.
        </h3>
      )}
    </header>
  );
};

export default Navbar;
