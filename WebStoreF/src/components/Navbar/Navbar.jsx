import Logo from "../../logo-no-background.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCaretDown,
  faCartShopping,
  faTruck,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import SkeletonNavAddress from "../shared/SkeletonNavAddress";
import NavCardMenu from "./NavCardMenu";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";

const Navbar = ({
  user,
  address,
  fetchingAddress,
  toggleCard,
  setToggleCard,
  setToggleCart,
}) => {
  const [cartItemsNum, setCartItemsNum] = useState(
    JSON.parse(localStorage.getItem("cart"))?.length
  );

  const navigate = useNavigate();
  const [yourAddress, setYourAddress] = useState([]);
  const [url, setUrl] = useState(null);
  const [search, setSearch] = useState("");

  const {
    data: result,
    loading: searching,
    error: searchError,
  } = useFetchApi(url, "GET");

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

  useEffect(() => {
    var delayDebounceFn;
    if (search) {
      delayDebounceFn = setTimeout(() => {
        setUrl(`/search?search=${search}`);
      }, 2000);
    }

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <header>
      <nav>
        <div
          className={
            "w-full h-[80px] bg-[#152128] py-2 px-4 flex items-center justify-between text-white"
          }
        >
          <a href="/">
            <img className="h-[50px] max-md:h-[30px]" alt="logo" src={Logo} />
          </a>
          <div className="flex items-center gap-2 cursor-pointer hover-border p-2 text-[10pt] w-fit max-md:hidden">
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
          <div className="relative z-10 w-full h-9 max-md:w-1/2 text-black">
            <div className="rounded-md h-full flex overflow-hidden">
              <input
                className="w-full px-3"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="w-[40px] h-full bg-orange-300 hover:bg-orange-400 transition-colors duration-200">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ color: "#152128" }}
                />
              </button>
            </div>
            {(searching || result) && (
              <div className="absolute w-full top-[102%] h-max bg-white flex flex-col gap-2">
                {searching ? (
                  <div className="h-[50px] py-6 flex items-center justify-center w-full">
                    <LoadingSpinner />
                  </div>
                ) : result && result.products.length > 0 ? (
                  result.products.map((item) => {
                    return (
                      <div
                        onClick={() =>
                          navigate(`/catalog/${item.title}/${item._id}`)
                        }
                        className="flex py-2 px-4 items-center gap-2 group bg-white cursor-pointer hover:bg-[#188fa7]"
                      >
                        <div className="h-[50px] w-[50px] bg-white flex rounded-full overflow-hidden">
                          <img
                            className="w-full object-contain"
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        </div>
                        <p className="select-none pointer-events-none group-hover:text-white">
                          {item.title}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-6">
                    Nenhum resultado encontrado
                  </p>
                )}
              </div>
            )}
          </div>
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
              <NavCardMenu user={user} setToggleCard={setToggleCard} />
            )}
          </div>
          <div className="hover-border p-2 items-center cursor-pointer w-fit hidden max-md:flex">
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "#94989e" }}
              size="xl"
            />
          </div>
          <div
            onClick={() => {
              setToggleCart(true);
            }}
            className="cursor-pointer flex items-center p-2 hover-border min-w-[150px] justify-around max-md:min-w-fit max-md:justify-center"
          >
            <p className="max-md:hidden">Seu carrinho </p>
            <FontAwesomeIcon
              icon={faCartShopping}
              size="xl"
              style={{ color: "#94989e" }}
            />
            <span>{cartItemsNum > 0 && cartItemsNum}</span>
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
