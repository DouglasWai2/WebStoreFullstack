import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    const baseUrl = 'http://localhost:5000'
    e.preventDefault()
        try {
            const response = await axios.post(baseUrl + '/auth/register',{
                name,
                lastName,
                email,
                phone,
                password
            },{
                headers: {
                    "content-type":
                "application/x-www-form-urlencoded;charset=utf-8",
                }
            })
            navigate('/')
        } catch (error) {
            console.log(error)
        }
  }

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
    <main className="flex flex-col z-[-1] justify-center items-center w-screen h-screen bg-[#F9F7F1]">
      <div className="w-[500px] rounded-lg shadow-md p-8 py-24">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-8 relative">
          <div className="flex justify-between">
            <label htmlFor="Nome" className="flex flex-col">
              <span className="flex justify-between">Nome</span>
              <input
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
              value={phone}
              onChange={handlePhone}
              className={"input-login"}
              type="tel"
              name="phone"
            />
          </label>
          <label htmlFor="password" className="flex flex-col">
            <span className="flex justify-between">Senha</span>
            <input
              value={password}
              onChange={handlePassword}
              className={"input-login"}
              type="password"
              name="password"
            />
          </label>
          <label htmlFor="passwordConfirm" className="flex flex-col">
            <span className="flex justify-between">Confirmar senha</span>
            <input
              value={confirmPassword}
              onChange={handleConfirmPassword}
              className={"input-login"}
              type="password"
              name="passwordConfirm"
            />
          </label>
          <button className="button-login" type="submit">
            Criar conta
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterForm;
