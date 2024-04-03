import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import cardAnimation from "../../assets/WebSiteCardAnimaion.json";
import flowAnimation from "../../assets/FlowForm.mp4";
import productAnimation from "../../assets/productAnimation.json";
import deliveryAnimation from "../../assets/deliveryAnimation.json";
import { Carousel } from "react-responsive-carousel";
import StoreSection from "../../components/Store/StoreSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import LoadingSpinner from "../../components/shared/UI/LoadingSpinner";

const Store = () => {
  const location = useLocation();
  const [url, setUrl] = useState(null);
  const { user, loading, refreshUser } = useOutletContext();
  const { data, loading: fetching, error, refresh } = useFetchApi(url, "GET");

  useEffect(() => {
    if (user?.role === "Seller") setUrl("/store/my-store");
  }, [user]);

  const navigate = useNavigate();

  return location.pathname === "/store" ? (
    <div className="p-3">
      <div className="absolute flex gap-1 bg-white shadow rounded-xl px-5 py-1 z-10">
        Concluídos{" "}
        {fetching ? (
          <LoadingSpinner size="20px" color="black" />
        ) : data?.products.length ? (
          "3"
        ) : data?.storeAddress ? (
          "2"
        ) : user?.role === "Seller" ? (
          "1"
        ) : (
          "0"
        )}{" "}
        de 3
      </div>
      <Carousel emulateTouch showArrows={false}>
        <StoreSection id="welcome" first>
          <h1 className="text-2xl">
            Seja bem-vindo a área do vendedor da WebStore
          </h1>
          <div className="flex items-center justify-center gap-4 max-lg:flex-col-reverse">
            <p className="text-lg">
              Anuncie seu produto na WebStore e aproveite uma plataforma segura
              e com suporte.
            </p>

            <Player
              autoplay={true}
              loop={true}
              src={cardAnimation}
              className="w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px]"
            ></Player>
          </div>
        </StoreSection>
        <StoreSection done={user?.role === "Seller"} className="">
          <p className="text-2xl">
            <span className="text-2xl text-slate-800">1.</span> O primeiro passo
            é registrar sua loja{" "}
          </p>
          <div className="flex flex-col items-center justify-around gap-4">
            <div className="flex items-center justify-around gap-4 max-lg:flex-col">
              <video
                className="w-[700px] h-[500px] max-sm:w-[400px] max-sm:h-[300px] overflow-hidden"
                autoPlay
                muted
                loop
              >
                <source src={flowAnimation} type="video/mp4" />
              </video>

              <div>
                <p className="max-w-[400px]">
                  Nessa etapa você vai definir o nome para sua loja (que será
                  único), a descrição, a imagem (logotipo) e a categoria.
                </p>
              </div>
            </div>
            <button
              disabled={user?.role === "Seller"}
              onClick={() => {
                navigate("/store/signup");
              }}
              className={
                "bg-[#152128] text-white px-4 py-2 rounded w-full " +
                (user?.role === "Seller" && "bg-green-600")
              }
            >
              {user?.role === "Seller" ? (
                <>
                  <FontAwesomeIcon icon={faCircleCheck} /> Feito
                </>
              ) : (
                "Clique aqui para começar"
              )}
            </button>
          </div>
        </StoreSection>
        <StoreSection done={data?.storeAddress ? true : false}>
          <p className="text-2xl">
            <span className="text-2xl text-slate-800">2.</span> O segundo passo
            é colocar as informações da sua loja
          </p>
          <div className="flex flex-col items-center justify-around gap-4">
            <div className="flex h-full items-center justify-center gap-4 max-lg:flex-col-reverse">
              <p className="text-left">
                Nesta etapa você vai colocar o endereço da sua loja (de onde os
                produtos vão sair)
                <br />
                <br />
                <span className="!text-sm">
                  Você pode fazer isso clicando{" "}
                  <Link className="link" to="my-store">
                    neste link
                  </Link>{" "}
                  ou na barra de navegação clicando no seu nome (ou no botão{" "}
                  {<FontAwesomeIcon className="text-gray-500" icon={faBars} />})
                  e "Minha loja".
                </span>
              </p>

              <Player
                autoplay={true}
                loop={true}
                src={deliveryAnimation}
                className="w-[400px] h-[500px] max-sm:w-[200px] max-sm:h-[200px]"
              ></Player>
            </div>
            {data?.storeAddress && (
              <div className="text-green-600 text-lg px-4 py-2">
                {" "}
                <>
                  <FontAwesomeIcon icon={faCircleCheck} /> Feito
                </>
              </div>
            )}
          </div>
        </StoreSection>
        <StoreSection done={data?.products.length} last>
          <p className="text-2xl">
            <span className="text-2xl text-slate-800">3.</span> O terceiro passo
            é cadastrar seu(s) produto(s)
          </p>
          <div className="flex items-center justify-center gap-4 max-lg:flex-col-reverse">
            <p className="text-left">
              Siga as instruções do formulário e preencha os campos
              corretamente. Após submeter o formulário, seu produto ficará
              visível para todos os usuarios.
              <br />
              <br />
              <span className="!text-sm">
                Você pode fazer isso clicando{" "}
                <Link className="link" to="new-product">
                  neste link
                </Link>{" "}
                ou na barra de navegação clicando no seu nome (ou no botão{" "}
                {<FontAwesomeIcon className="text-gray-500" icon={faBars} />}) e
                "Cadastrar novo produto"{" "}
              </span>
            </p>

            <Player
              autoplay={true}
              loop={true}
              src={productAnimation}
              className="w-[500px] h-[500px] max-sm:w-[200px] max-sm:h-[200px]"
            ></Player>
          </div>
          {!!data?.products.length && (
            <div className="text-green-600 text-lg px-4 py-2">
              {" "}
              <>
                <FontAwesomeIcon icon={faCircleCheck} /> Feito
              </>
            </div>
          )}
        </StoreSection>
      </Carousel>
    </div>
  ) : (
    <Outlet context={{ user, loading, refreshUser, refresh }} />
  );
};

export default Store;
