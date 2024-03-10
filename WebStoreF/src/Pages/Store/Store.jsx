import React from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import cardAnimation from "../../assets/WebSiteCardAnimaion.json";
import flowAnimation from "../../assets/FlowForm.mp4";
import productAnimation from "../../assets/productAnimation.json";
import deliveryAnimation from "../../assets/deliveryAnimation.json";
import { Carousel } from "react-responsive-carousel";
import StoreSection from "../../components/Store/StoreSection";

const Store = () => {
  const location = useLocation();
  const { user, loading, refreshUser } = useOutletContext();

  return location.pathname === "/store" ? (
    <main className="py-3 flex justify-center bg-white store-tutorial">
      <div className="w-full flex items-center">
        <Carousel emulateTouch>
          <StoreSection>
            <h1 className="text-2xl text-center">
              Seja bem-vindo a área do vendedor da WebStore
            </h1>
            <div className="flex items-center justify-center">
              <p className="max-w-[300px]">
                Anuncie seu produto na WebStore e aproveite uma plataforma
                segura e com suporte.
              </p>

              <Player
                autoplay={true}
                loop={true}
                src={cardAnimation}
                style={{ height: "500px", width: "500px" }}
              ></Player>
            </div>
          </StoreSection>
          <StoreSection className="flex flex-col justify-center">
            <p className="text-2xl">
              <span className="text-2xl text-slate-800">1.</span> O primeiro
              passo é registrar sua loja{" "}
            </p>
            <div className="flex items-center justify-around gap-3">
              <div className="py-10">
                <video width="700" height="600" autoPlay muted loop>
                  <source src={flowAnimation} type="video/mp4" />
                </video>
              </div>
              <div>
                <p className="max-w-[400px]">
                  Nessa etapa você vai definir o nome para sua loja (que será
                  único), a descrição a imagem e a categoria.
                </p>
              </div>
            </div>
          </StoreSection>
          <StoreSection>
            <p>
              <span className="text-2xl text-slate-800">2.</span> O segundo
              passo é colocar as informações da sua loja
              <br></br>
              <span className="!text-lg">
                Você pode fazer isso clicando{" "}
                <Link className="link !text-lg" to="my-store">
                  neste link
                </Link>{" "}
                ou na barra de navegação clicando no seu nome e "Minha loja".
              </span>
            </p>
            <p>
              Nesta etapa você vai colocar o endereço da sua loja (de onde os
              produtos vão sair)
            </p>

            <Player
              autoplay={true}
              loop={true}
              src={deliveryAnimation}
              style={{ height: "500px", width: "500px" }}
            ></Player>
          </StoreSection>
          <StoreSection>
            <p>
              <span className="text-2xl text-slate-800">3.</span> O terceiro
              passo é cadastrar seu(s) produto(s).
              <br></br>
              <span className="text-sm">
                Você pode fazer isso clicando{" "}
                <Link className="link" to="new-product">
                  neste link
                </Link>{" "}
                ou na barra de navegação clicando no seu nome e "Cadastrar novo
                produto"{" "}
              </span>
            </p>
            <p>
              Siga as instruções do formulário e preencha os campos
              corretamente. Após submeter o formulário, seu produto ficará
              visível para todos os usuarios.
            </p>

            <Player
              autoplay={true}
              loop={true}
              src={productAnimation}
              style={{ height: "500px", width: "500px" }}
            ></Player>
          </StoreSection>
        </Carousel>
      </div>
    </main>
  ) : (
    <Outlet context={{ user, loading, refreshUser }} />
  );
};

export default Store;
