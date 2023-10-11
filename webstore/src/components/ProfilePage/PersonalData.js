import axios from "axios";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "../../helpers/formatPhoneNumber";
import { refreshToken } from "../../helpers/refreshToken";
import { logOut } from "../../helpers/logOut";
import SkeletonData from "./SkeletonPersonalData";
import EditButton from "./EditButton";

const PersonalData = () => {
  const [userInfo, setUserInfo] = useState({
    Nome: "",
    "Ultimo Nome": "",
    Email: "",
    Celular: "",
    CPF: "",
    "Data de Nascimento": "",
    Endereço: "",
  });
  const token = window.localStorage.getItem("accessToken");
  const userId = window.localStorage.getItem("userid");
  const [loading, setLoading] = useState(false);
  

  const getUserData = async () => {
    setLoading(true);

    try {
      const data = await axios.get(
        `http://localhost:5000/api/${userId}/${token}`,
        { withCredentials: true }
      );

      const { name, lastName, email, phone, cpf, birth, address } = data.data;
      setUserInfo((userInfo) => ({
        ...userInfo,
        Nome: name,
        "Ultimo Nome": lastName,
        Email: email,
        Celular: phone,
        CPF: cpf,
        "Data de Nascimento": birth,
        Endereço: address,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error?.response.data === "Invalid Token") {
        try {
          await refreshToken();
          getUserData();
        } catch (error) {
          console.log(error);
          if (
            error?.response.data === "Access Denied. No refresh token provided."
          ) {
            console.log(error);
            logOut();
          }
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="w-[80%] border-[2px] rounded-md overflow-hidden shadow-md">
      {loading ? (
        <SkeletonData />
      ) : (
        <table className="w-full">
          <tbody className="w-full">
            {Object.keys(userInfo).map((item) => {
              // const newItem = item.replace(/_/g, ' ');
              return (
                <tr className="flex border-b-[1px] p-10 w-full">
                  <th className="flex w-[20%]">{item}:</th>
                  <td className="w-full flex justify-between">
                    <span className="ml-5">
                      {item === "Celular"
                        ? formatPhoneNumber(userInfo[item])
                        : !userInfo[item]
                        ? (item === "Data de Nascimento"
                            ? "Insira uma "
                            : "Insira um ") + item
                        : userInfo[item]}
                    </span>
                    <EditButton />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PersonalData;
