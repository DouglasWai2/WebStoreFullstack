import React from "react";
import {
  Link,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import cardAnimation from "../../assets/WebSiteCardAnimaion.json";

const Store = () => {
  const location = useLocation();
  const { user, loading, refreshUser } = useOutletContext();


  return location.pathname === "/store" ? (
    <main className="py-3 px-8 bg-white">
      <h1 className="text-2xl">Seja bem-vindo a área do vendedor</h1>
      <p>
        Anuncie seu produto na WebStore e aproveite uma plataforma segura e com
        suporte.
      </p>
      <div className="w-[500px]">
        <Player
          autoplay={true}
          loop={true}
          src={cardAnimation}
          style={{ height: "500px", width: "500px" }}
        ></Player>
      </div>
      <p>
        <span className="text-2xl text-slate-800">1.</span> O primeiro passo é
        registrar sua loja{" "}
        <Link className="link !text-base" to="signup">
          neste link.
        </Link>
      </p>
      <p>
        <span className="text-2xl text-slate-800">2.</span> O segundo passo é
        colocar as informações da sua loja
        <br></br>
        <span className="text-sm">
          Você pode fazer isso clicando{" "}
          <Link className="link" to="my-store">
            neste link
          </Link>{" "}
          ou na barra de navegação clicando no seu nome e "Minha loja".
        </span>
      </p>

      <p>
        <span className="text-2xl text-slate-800">3.</span> O terceiro passo é
        cadastrar seu(s) produto(s).
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
    </main>
  ) : (
    <Outlet context={{ user, loading, refreshUser }} />
  );
};

export default Store;
