import axios from "axios";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from '../../helpers/formatPhoneNumber'
import { refreshToken } from "../../helpers/refreshToken";
import { logOut } from "../../helpers/logOut";

const PersonalData = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [birth, setBirth] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    birth: '',
    address: '',
  })

  const getUserData = async () => {
    const token = window.localStorage.getItem("accessToken");
    const userId = window.localStorage.getItem("userid");

    try {
      const data = await axios.get(
        `http://localhost:5000/api/${userId}/${token}`,
        { withCredentials: true }
      );

      const { name, lastName, email, phone, cpf, birth, address } = data.data
      setUserInfo(userInfo => ({
        ...userInfo,
        name,
        lastName,
        email,
        phone,
        cpf,
        birth,
        address
      }))
      console.log(userInfo)
      setName(data.data.name);
      setLastName(data.data.lastName);
      setEmail(data.data.email);
      setPhone(data.data.phone);
      setCpf(data.data.cpf);
      setBirth(data.data.birth);
    } catch (error) {
      console.log(error);
      if (error?.response.data === "Invalid Token") {
        try {
          await refreshToken()
        } catch (error) {
            console.log(error)
            if (error?.response.data === "Access Denied. No refresh token provided.") {
                logOut()
            }
            
        }
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);


  return (
    <div className="w-[80%] border-[2px] rounded-md overflow-hidden shadow-md">
      <table className="w-full">
        <tbody className="w-full">
          <tr className="flex border-b-[1px] p-10 w-full">
            <th>Nome:</th>
            <td className="w-full flex justify-between">
              <span className="ml-5">{name + " " + lastName}</span>
              <button>Editar</button>
            </td>
          </tr>
          <tr className="flex border-b-[1px] p-10 w-full">
            <th>Email:</th>
            <td className="w-full flex justify-between">
              <span className="ml-5">{email}</span> <button>Editar</button>
            </td>
          </tr>
          <tr className="flex border-b-[1px] p-10 w-full">
            <th>Celular:</th>
            <td className="w-full flex justify-between">
              <span className="ml-5">{formatPhoneNumber(phone)}</span>{" "}
              <button>Editar</button>
            </td>
          </tr>
          <tr className="flex border-b-[1px] p-10 w-full">
            <th>CPF:</th>
            <td className="w-full flex justify-between">
              <span className="ml-5">{cpf ? cpf : "Insira seu cpf"}</span>
              <button>Editar</button>
            </td>
          </tr>
          <tr className="flex border-b-[1px] p-10 w-full">
            <th>Data de nascimento:</th>
            <td className="w-full flex justify-between">
              <span className="ml-5">
                {birth ? birth : "Insira sua data de nascimento"}
              </span>
              <button>Editar</button>
            </td>
          </tr>
          <tr className="flex p-10 w-full">
            <th>Endereço principal:</th>
            <td className="w-full flex justify-between">
              <span className="ml-5">Nenum endereço selecionado</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PersonalData;
