import Logo from "../logo-no-background-2.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Google from "../assets/google.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../hooks/useFetchApi";
import SubmitButton from "../components/shared/SubmitButton";
import { useGoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const [invalid, setInvalid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState(null);
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setBody(codeResponse);
      setUrl("/auth/login/google");
      if (error) refresh();
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setBody({ email, password });
    setUrl("/auth/login");
  };
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);

  const {
    data: userData,
    loading,
    error,
    refresh,
  } = useFetchApi(url, "POST", body);

  useEffect(() => {
    if (!loading && error?.data.error === "User does not exist") {
      setInvalid("E-mail ou senha incorretos");
    } else if (!loading && error?.data.error === "Wrong password") {
      setInvalid("Senha incorreta");
    }

    // If logged in successfully set cookie and redirect
    if (userData?.authorization) {
      window.localStorage.setItem("accessToken", userData.authorization);
      document.cookie = "loggedin=True; path=/";
      window.location.pathname = "/";
    }
  }, [error, userData, loading]);

  return (
    <>
      <main className="flex flex-col justify-center items-center w-screen h-screen overflow-scroll bg-[#F9F7F1]">
        {invalid && (
          <div className="absolute top-[100px] bg-white rounded-sm border-[1px] border-red-500 text-red-500 p-4">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {invalid}
            <button
              onClick={() => {
                setInvalid("");
              }}
              className="ml-5"
            >
              X
            </button>
          </div>
        )}
        <div className="w-[500px] rounded-lg shadow-md p-8 py-24 max-sm:w-[300px]">
          <a href="/">
            <img src={Logo} />
          </a>
          <form
            className="flex flex-col justify-center gap-8 relative"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email" className="flex flex-col">
              <span className="flex justify-between">E-mail</span>
              <input
                className={"input-login"}
                type="email"
                name="email"
                onChange={handleEmailInput}
                value={email}
              />
            </label>
            <label htmlFor="password" className="flex flex-col">
              Senha
              <input
                className="input-login"
                type="password"
                name="password"
                onChange={handlePasswordInput}
                value={password}
              />
            </label>
            <SubmitButton
              onClick={handleSubmit}
              loading={loading}
              text="Fazer Login"
            />
            <div className="relative flex justify-center w-full text-gray-500">
              <span className="w-full border-b-[1px] border-gray-500 absolute top-[50%]"></span>
              <p className="bg-[#F9F7F1] z-10 px-4">Ou faça login com</p>
            </div>
            <button
              onClick={() => login()}
              className="flex justify-center items-center gap-2 py-2
             border-gray-200 border-[1px] bg-white hover:bg-gray-100 rounded-sm
             duration-200 font-semibold
             "
            >
              Google
              <img className="h-4" src={Google} />
            </button>
          </form>
        </div>
        <div className="mt-6 text-center w-full box-shadow-bottom">
          <h3>É novo por aqui?</h3>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white border-[#D7E3EA] border-[1px] px-16 py-1 rounded-md mt-2"
          >
            Crie sua conta
          </button>
        </div>
      </main>
    </>
  );
};

export default LoginForm;
