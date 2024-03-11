import InputMask from "react-input-mask";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-no-background-2.svg";
import RegisterRegex from "../components/RegisterForm/RegisterRegex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useFetchApi } from "../hooks/useFetchApi";
import SubmitButton from "../components/shared/SubmitButton";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [regexVisible, setRegexVisible] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const {
    name,
    lastName,
    email,
    confirmEmail,
    phone,
    password,
    confirmPassword,
  } = registerInfo;
  const [body, setBody] = useState(null);

  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );

  const { data, loading, error, refresh } = useFetchApi(
    "/auth/register",
    "POST",
    body
  );

  useEffect(() => {
    if (data) {
      navigate("/register/user/verify");
    }

    if (error) {
      if (error.data.message === "already registered") {
        return setErrMessage("Email ou celular já registrado");
      }

      if (error?.data.error.errors) {
        Object.keys(error.data.error.errors).forEach((key) => {
          document.getElementsByName(key)[0].classList.add("!border-red-500");
          setErrMessage("Preencha os campos corretamente");
        });
        return;
      }

      setErrMessage(
        "Ocorreu um erro inesperado, tente novamente em alguns instantes"
      );
    }
  }, [data, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanPhone = phone.replace(/\D+/g, "");

    if (
      !name ||
      !lastName ||
      !email ||
      !confirmEmail ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setErrMessage("Preencha todos os campos");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setErrMessage("Email inválido");
      return;
    }

    if (email !== confirmEmail) {
      setErrMessage("E-mails não conferem");
      return;
    }

    if (!strongPassword.test(password)) {
      setErrMessage("Escolha uma senha mais forte");
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
    if (error) refresh();
  };

  useEffect(() => {
    if (email && password && confirmPassword && phone && name && lastName) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password, confirmPassword, phone, name, lastName]);

  const handleInputChange = (e) => {
    setRegisterInfo((registerInfo) => ({
      ...registerInfo,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <main className="flex flex-col z-[-1] p-10 justify-center items-center w-screen bg-[#fcfcfc] max-sm:px-0">
      <div className="w-full max-w-[600px] rounded-lg shadow-md p-8 py-20">
        {errMessage !== "" && (
          <div
            className="fixed flex top-4 gap-3 justify-center items-center z-10 bg-white rounded-sm border-[1px]
          left-0 right-0 mx-auto my-0 w-full max-w-[350px]
           border-red-500 text-red-500 p-4 animate-expand"
          >
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {errMessage}
            <button onClick={() => setErrMessage("")} className="ml-5 right-4">
              X
            </button>
          </div>
        )}
        <a href="/">
          <img className="w-[200px]" src={Logo} alt="logo" />
        </a>
        <form
          onSubmit={handleInputChange}
          className="flex flex-col justify-center gap-8 relative"
        >
          <div className="flex gap-2 justify-between max-sm:flex-col max-sm:gap-8">
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
          <label htmlFor="password" className="flex flex-col relative">
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
              onFocus={() => setRegexVisible(true)}
              onBlur={() => setRegexVisible(false)}
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
            {regexVisible && <RegisterRegex password={registerInfo.password} />}
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
          <div className="h-[50px]">
            <SubmitButton
              disabled={disabled}
              onClick={handleSubmit}
              loading={loading}
              text="Criar conta"
            />
          </div>
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
