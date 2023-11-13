import axios from "axios";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "../../helpers/formatPhoneNumber";
import { refreshToken } from "../../helpers/getRefreshToken";
import { logOut } from "../../helpers/logOut";
import EditButton from "../../components/User/EditButton";
import SkeletonData from "../../components/User/PersonalData/SkeletonPersonalData";
import { handleError } from "../../helpers/handleError";


const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    Nome: "",
    "Ultimo Nome": "",
    Email: "",
    Celular: "",
    CPF: "",
    "Data de Nascimento": "",
    Endereço: "",
  });

  const [loading, setLoading] = useState(false);
  

  const getUserData = async () => {
    setLoading(true);
    const token = window.localStorage.getItem("accessToken");

    try {
      const data = await axios.get(
        `http://localhost:5000/api/${token}`,
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
        handleError(error, getUserData)
    } finally{
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
              return (
                <tr key={item} className="flex border-b-[1px] p-10 w-full">
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

export default ProfilePage;
