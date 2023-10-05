import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../logo-no-background-2.svg";
import RegisterRegex from "../components/RegisterForm/RegisterRegex";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from "../components/shared/LoadingSpinner";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMessage, setErrMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );

  const handleSubmit = async (e) => {
    setIsLoading(true)
    const baseUrl = "https://localhost:3001";
    e.preventDefault();

    if(!strongPassword.test(password)){
      setErrMessage('Escolha uma senha mais forte')
      setIsLoading(false)
      return
    }
    if(email !== confirmEmail){
      setErrMessage('E-mails não conferem')
      setIsLoading(false)
      return
    }

    if(password !== confirmPassword){
      setErrMessage('Senhas não conferem')
      setIsLoading(false)
      return
    }


    try {
      const response = await axios.post(
        baseUrl + "/auth/register",
        {
          name,
          lastName,
          email,
          phone,
          password,
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      navigate("/login");
    } catch (error) {
        console.log(error)
      // if(Object.keys(error.response.data.err).includes('phone')){
      //   setErrMessage('Número de celular já cadastrado')
      // } else if(Object.keys(error.response.data.err).includes('email')){
      //   setErrMessage('E-mail já cadastrado')
      // } else{
      //   setErrMessage('Erro inesperado. Tente novamente')
      // }
      setIsLoading(false)
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleConfirmEmail = (e) => {
    setConfirmEmail(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <main className="flex flex-col z-[-1] p-10 justify-center items-center w-screen bg-[#F9F7F1]">  
      <div className="w-[500px] relative rounded-lg shadow-md p-8 py-20">
      {errMessage !== "" && (
        <div className="relative bg-white rounded-sm border-[1px] border-red-500 text-red-500 p-4">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {errMessage}
          <button onClick={() => setErrMessage('')} className="ml-5 absolute right-4">X</button>
        </div>
      )}
        <a href="/">
          <img className="w-[200px] absolute top-5" src={Logo} alt="logo" />
        </a>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-8 relative"
        >
          <div className="flex justify-between">
            <label htmlFor="Nome" className="flex flex-col">
              <span className="flex justify-between">Nome</span>
              <input
                required
                value={name}
                onChange={handleName}
                className={"input-login"}
                type="text"
                name="Nome"
              />
            </label>
            <label htmlFor="sobrenome" className="flex flex-col">
              <span className="flex justify-between">Sobrenome</span>
              <input
                required
                value={lastName}
                onChange={handleLastName}
                className={"input-login"}
                type="text"
                name="sobrenome"
              />
            </label>
          </div>
          <label htmlFor="email" className="flex flex-col">
            <span className="flex justify-between">E-mail</span>
            <input
              required
              value={email}
              onChange={handleEmail}
              className={"input-login"}
              type="email"
              name="email"
            />
          </label>
          <label htmlFor="emailConfirm" className="flex flex-col">
            <span className="flex justify-between">Confirmar e-mail</span>
            <input
              required
              value={confirmEmail}
              onChange={handleConfirmEmail}
              className={"input-login"}
              type="email"
              name="emailConfirm"
            />
          </label>
          <label htmlFor="phone" className="flex flex-col">
            <span className="flex justify-between">Celular</span>
            <input
              required
              value={phone}
              onChange={handlePhone}
              className={"input-login"}
              type="tel"
              name="phone"
            />
          </label>
          <label htmlFor="password" className="flex flex-col">
            <span className="flex justify-between">
              Senha{" "}
              {password !== "" ? (
                strongPassword.test(password) ? (
                  <span className="text-green-500">Senha forte</span>
                ) : mediumPassword.test(password) ? (
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
              value={password}
              onChange={handlePassword}
              className={
                "input-login " +
                (password !== ""
                  ? strongPassword.test(password)
                    ? "!border-green-300"
                    : mediumPassword.test(password)
                    ? "!border-yellow-500"
                    : "!border-red-500"
                  : "")
              }
              type="password"
              name="password"
            />
            <RegisterRegex password={password} />
          </label>
          <label htmlFor="passwordConfirm" className="flex flex-col">
            <span className="flex justify-between">Confirmar senha</span>
            <input
              required
              value={confirmPassword}
              onChange={handleConfirmPassword}
              className={"input-login"}
              type="password"
              name="passwordConfirm"
            />
          </label>
          <button className={"button-login flex items-center justify-center" + (isLoading ? " brightness-75 pointer-events-none" : '')} type="submit">
          {isLoading ? <LoadingSpinner /> : 'Criar conta'}
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
