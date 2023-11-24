import React from "react";
import { Link, Outlet, useLocation} from "react-router-dom";

const Merchant = () => {
  const location = useLocation()

  return location.pathname === "/store" ? (
    <main>
      <h1 className="text-2xl">Seja bem-vindo a área do vendedor</h1>
      <p>
        Anuncie seu produto na WebStore e aproveite uma plataforma segura e com
        suporte.
      </p>
      <p>
        Primeiro passo é registrar sua loja{" "}
        <Link className="link !text-base" to="signup">
          neste link.
        </Link>
      </p>
      <p>
        O segundo passo é colocar as informações da sua loja
        <br></br>
        <span className="text-sm">
          Você pode fazer isso clicando neste link ou na barra de navegação
          clicando no seu nome e "Minha loja" ou{" "}
        </span>{" "}
        <Link className="link !text-base" to="my-store">
          neste link.
        </Link>
      </p>

      <p>
        O terceiro passo é cadastrar seu(s) produto(s).
        <br></br>
        <span className="text-sm">
          Você pode fazer isso clicando neste link ou na barra de navegação
          clicando no seu nome e "Cadastrar novo produto"{" "}
        </span>
      </p>
    </main>
  ) : (
    <Outlet />
  );
};

export default Merchant;
