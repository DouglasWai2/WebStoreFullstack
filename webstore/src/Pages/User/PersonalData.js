import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonData from "../../components/User/PersonalData/SkeletonPersonalData";
import { handleError } from "../../helpers/handleError";
import TableData from "../../components/User/PersonalData/TableData";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState([
    { Nome: "" },
    { "Ultimo Nome": "" },
    { Email: "" },
    { Celular: "" },
    { CPF: "" },
    { "Data de Nascimento": "" },
    { Endereço: "" },
  ]);
  const [editForm, setEditForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    setLoading(true);
    const token = window.localStorage.getItem("accessToken");

    try {
      const data = await axios.get(`http://localhost:5000/api/${token}`, {
        withCredentials: true,
      });
      const varToString = (varObj) => {
        return Object.keys(varObj)[0];
      };

      const { name, lastName, email, phone, cpf, birth, address } = data.data;

      // This function is needed due to the differences between the timezone stored in database and the client OS time zone, wich causes it to render an wrong date
      function formatDate(date) {
        const splitted = date.split("-"); // the date comes in string data type and it's splitted to get day, month and year
        const newDate = new Date(
          parseInt(splitted[0]),
          parseInt(splitted[1]) - 1,
          parseInt(splitted[2][0] + splitted[2][1])
        ); // new Date object is created here with the current client OS timezone
        return newDate.toLocaleDateString(); // then, it's converted to string again and in the current local format (DD/MM/YYYY)
      }

      setUserInfo([
        { Nome: name, value: varToString({ name }) },
        { "Ultimo Nome": lastName, value: varToString({ lastName }) },
        { Email: email, value: varToString({ email }) },
        { Celular: phone, value: varToString({ phone }) },
        { CPF: cpf || "", value: varToString({ cpf }) },
        {
          "Data de Nascimento": formatDate(birth) || "",
          value: varToString({ birth }),
        },
        { Endereço: address || "", value: varToString({ address }) },
      ]);
      setLoading(false);
    } catch (error) {
      handleError(error, getUserData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    let newArr = [...userInfo];
    newArr[index][e.target.name] = e.target.value;
    setUserInfo(newArr);
  };

  const editUserData = async () => {
    const token = window.localStorage.getItem("accessToken");

    try {
      const data = await axios.post(
        `http://localhost:5000/api/user/update/${token}`,
        userInfo,
        {
          withCredentials: true,
        }
      );
      window.location.reload();
    } catch (error) {
      handleError(error, editUserData);
    } finally {
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
            {userInfo.map((item, index) => {
              return (
                <tr
                  key={Object.keys(item)[0]}
                  className="flex border-b-[1px] p-10 w-full"
                >
                  <th className="flex text-start items-center w-[20%]">
                    {Object.keys(item)[0]}:
                  </th>
                  <td className="w-full items-center flex justify-between">
                    <TableData
                      handleChange={handleChange}
                      editForm={editForm}
                      item={item}
                      index={index}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="w-full p-6">
        {!editForm ? (
          <button
            onClick={() => setEditForm(true)}
            className="bg-yellow-300 p-2 !w-full h-fit px-3 hover:bg-yellow-400"
          >
            Editar perfil
          </button>
        ) : (
          <button
            onClick={editUserData}
            className="bg-yellow-300 p-2 !w-full h-fit px-3 hover:bg-yellow-400"
          >
            Salvar
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
