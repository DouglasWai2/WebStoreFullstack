import InputMask from "react-input-mask";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../logo-no-background-2.svg";
import RegisterRegex from "../components/RegisterForm/RegisterRegex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { useFetchApi } from "../helpers/useFetchApi";

const RegisterForm = () => {
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [body, setBody] = useState(null);
  const navigate = useNavigate();
  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );

  const { data, loading, error } = useFetchApi("/auth/register", "POST", body);

  useEffect(() => {
    if (data) {
      navigate("/login");
    }

    if (error) {
      // TODO: handle errors
    }
  }, [data, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      name,
      lastName,
      email,
      confirmEmail,
      phone,
      password,
      confirmPassword,
    } = registerInfo;
    const cleanPhone = phone.replace(/\D+/g, "");

    if (!strongPassword.test(password)) {
      setErrMessage("Escolha uma senha mais forte");
      setIsLoading(false);
      return;
    }
    if (email !== confirmEmail) {
      setErrMessage("E-mails não conferem");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrMessage("Senhas não conferem");
      setIsLoading(false);
      return;
    }

    registerInfo.phone = cleanPhone;

    setBody(registerInfo);
  };

  const handleInputChange = (e) => {
    setRegisterInfo((registerInfo) => ({
      ...registerInfo,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="flex flex-col z-[-1] p-10 justify-center items-center w-screen bg-[#F9F7F1]">
      <div className="w-[500px] relative rounded-lg shadow-md p-8 py-20">
        {errMessage !== "" && (
          <div className="relative bg-white rounded-sm border-[1px] border-red-500 text-red-500 p-4">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {errMessage}
            <button
              onClick={() => setErrMessage("")}
              className="ml-5 absolute right-4"
            >
              X
            </button>
          </div>
        )}
        <a href="/">
          <img className="w-[200px] absolute top-5" src={Logo} alt="logo" />
        </a>
        <form
          onSubmit={handleInputChange}
          className="flex flex-col justify-center gap-8 relative"
        >
          <div className="flex justify-between">
            <label htmlFor="Nome" className="flex flex-col">
              <span className="flex justify-between">Nome</span>
              <input
                required
                value={registerInfo.name}
                onChange={handleInputChange}
                className={"input-login"}
                type="text"
                name="name"
              />
            </label>
            <label htmlFor="sobrenome" className="flex flex-col">
              <span className="flex justify-between">Sobrenome</span>
              <input
                required
                value={registerInfo.lastName}
                onChange={handleInputChange}
                className={"input-login"}
                type="text"
                name="lastName"
              />
            </label>
          </div>
          <label htmlFor="email" className="flex flex-col">
            <span className="flex justify-between">E-mail</span>
            <input
              required
              value={registerInfo.email}
              onChange={handleInputChange}
              className={"input-login"}
              type="email"
              name="email"
            />
          </label>
          <label htmlFor="emailConfirm" className="flex flex-col">
            <span className="flex justify-between">Confirmar e-mail</span>
            <input
              required
              value={registerInfo.confirmEmail}
              onChange={handleInputChange}
              className={"input-login"}
              type="email"
              name="confirmEmail"
            />
          </label>
          <label htmlFor="phone" className="flex flex-col">
            <span className="flex justify-between">Celular</span>
            <InputMask
              required
              mask="(99)99999-9999"
              value={registerInfo.phone}
              onChange={handleInputChange}
              className={"input-login"}
              type="tel"
              name="phone"
            />
          </label>
          <label htmlFor="password" className="flex flex-col">
            <span className="flex justify-between">
              Senha{" "}
              {registerInfo.password !== "" ? (
                strongPassword.test(registerInfo.password) ? (
                  <span className="text-green-500">Senha forte</span>
                ) : mediumPassword.test(registerInfo.password) ? (
                  <span className="text-yellow-500">Senha média</span>
                ) : (
                  <span className="text-red-500">Senha fraca</span>
                )
              ) : (
                ""
              )}
            </span>
            <input
              required
              value={registerInfo.password}
              onChange={handleInputChange}
              className={
                "input-login " +
                (registerInfo.password !== ""
                  ? strongPassword.test(registerInfo.password)
                    ? "!border-green-300"
                    : mediumPassword.test(registerInfo.password)
                    ? "!border-yellow-500"
                    : "!border-red-500"
                  : "")
              }
              type="password"
              name="password"
            />
            <RegisterRegex password={registerInfo.password} />
          </label>
          <label htmlFor="passwordConfirm" className="flex flex-col">
            <span className="flex justify-between">Confirmar senha</span>
            <input
              required
              value={registerInfo.confirmPassword}
              onChange={handleInputChange}
              className={"input-login"}
              type="password"
              name="confirmPassword"
            />
          </label>
          <button
            onClick={handleSubmit}
            className={
              "button-login flex items-center justify-center" +
              (isLoading ? " brightness-75 pointer-events-none" : "")
            }
            type="submit"
          >
            {loading ? <LoadingSpinner /> : "Criar conta"}
          </button>
        </form>
        <h5 className="!text-[8pt] mt-3 w-full text-center">
          Ao se cadastrar você concorda com os{" "}
          <a
            className="link !text-[8pt]"
            target="_blank"
            href="/termsandconditions"
          >
            Termos de Uso
          </a>{" "}
          e{" "}
          <a className="link !text-[8pt]" target="_blank" href="/privacypolicy">
            Política de Privacidade
          </a>
        </h5>
      </div>
      <div className="my-6 text-center w-full">
        <h3>Já possui cadastro?</h3>
        <button
          onClick={() => navigate("/login")}
          className="bg-white border-[#D7E3EA] border-[1px] px-16 py-1 rounded-md mt-2"
        >
          Entrar
        </button>
      </div>
    </main>
  );
};

export default RegisterForm;
