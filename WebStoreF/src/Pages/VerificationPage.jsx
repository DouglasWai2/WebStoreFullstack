import React, { useEffect, useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useLocation, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Logo from "../assets/logo-no-background-2.svg";
const VerificationPage = () => {
  const location = useLocation();
  const [url, setUrl] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const { data, error, loading } = useFetchApi(url, "GET");

  useEffect(() => {
    console.log(error);
    if(data) setTimeout(() => window.location.href = "/", 3000)
  }, [data, error]);

  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");
    if (id && token) setUrl(`/auth/register/user/verify/${id}/${token}`);
  }, [location]);

  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen overflow-scroll bg-[#F9F7F1]">
      <div className="bg-white w-full flex flex-col justify-center items-center rounded-lg px-4 py-10 max-w-[1440px]">
        <img className="w-1/3" src={Logo} />
        {!searchParams.get("id") && !searchParams.get("token") && (
          <>
            <p className="text-lg text-center max-w-1/3 mt-3">
              Enviamos um email de verificação para você. Verifique sua caixa de
              entrada.
            </p>
            <a href="/login" className="hover:underline mt-2">
              Clique aqui para ir pra tela de login
            </a>
          </>
        )}
        {loading ? (
          <LoadingSpinner size={"w-[50px] h-[50px]"} />
        ) : (
          <>
            {data && (
              <p className="text-lg">
                Email verificado com sucesso. Redirecionando...
              </p>
            )}
            {error && <p className="text-center mt-3">Ocorreu um erro inesperado. Tente novamente.</p>}
          </>
        )}
      </div>
    </main>
  );
};

export default VerificationPage;
