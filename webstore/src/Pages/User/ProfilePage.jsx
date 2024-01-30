import { useEffect, useState } from "react";
import SkeletonData from "../../components/User/PersonalData/SkeletonPersonalData";
import TableData from "../../components/User/PersonalData/TableData";
import { useOutletContext } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import SubmitButton from "../../components/shared/SubmitButton";
import { formatPhoneNumber } from "../../helpers/formatPhoneNumber";
import { CPFMask } from "../../helpers/CPFMask";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [editForm, setEditForm] = useState(false);
  const [method, setMethod] = useState(null);
  const [editData, setEditData] = useState([
    { Nome: "", value: "name" },
    { "Ultimo Nome": "", value: "lastName" },
    { Email: "", value: "email" },
    { Celular: "", value: "phone" },
    { CPF: "", value: "cpf" },
    {
      "Data de Nascimento": "",
      value: "birth",
    },
  ]);
  const { data: response, loading: submiting } = useFetchApi(
    "/user/update",
    method,
    editData
  );

  const { user, address, loading } = useOutletContext();

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
  const varToString = (varObj) => {
    return Object.keys(varObj)[0];
  };

  const handleChange = (e, index) => {
    let newArr = [...editData];
    newArr[index][e.target.name] = e.target.value;
    setEditData(newArr);
  };

  useEffect(() => {
    if (user) {
      const { name, lastName, email, phone, cpf, birth } = user;
      let formatedBirth;
      if (birth) {
        formatedBirth = formatDate(birth);
      }
      setUserInfo([
        { Nome: name, info: "name", type: "text" },
        { "Ultimo Nome": lastName, info: "lastName", type: "text" },
        { Email: email, info: "email", type: "email" },
        { Celular: formatPhoneNumber(phone), info: "phone", type: "text" },
        { CPF: CPFMask(cpf) || "", info: "cpf", type: "text" },
        {
          "Data de Nascimento": formatedBirth || "",
          info: "birth",
          type: "date",
        },
      ]);
    }

    if (response && !loading) {
      window.location.reload();
    }
  }, [user, response]);

  function handleSubmit() {
    const cpf = userInfo.find((element) => element.info === "cpf");
    const phone = userInfo.find((element) => element.info === "phone");
    const indexCPF = userInfo.indexOf(cpf);
    const indexPhone = userInfo.indexOf(phone);
    let newArr = [...editData];
    newArr[indexCPF].CPF = newArr[indexCPF].CPF.replace(/\D/g, "");
    newArr[indexPhone].Celular = newArr[indexPhone].Celular.replace(/\D/g, "");
    setEditData(newArr);
    setMethod("POST");
  }

  return (
    <div className="w-[80%] border-[2px] rounded-md overflow-hidden shadow-md">
      {!user || !address ? (
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
                      editData={editData[index]}
                      item={item}
                      index={index}
                    />
                  </td>
                </tr>
              );
            })}
            <tr className="flex border-b-[1px] p-10 w-full">
              <th className="flex text-start items-center w-[20%]">Endereço</th>
              <td className="w-full items-center flex justify-between">
                <span className="ml-5">
                  {address && address.length
                    ? address[0].street + " - N° " + address[0].number
                    : "Adicione um endereço"}
                </span>
              </td>
            </tr>
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
          <div className="flex flex-col items-center gap-1">
            <div className="h-[42px] w-full">
              <SubmitButton
                onClick={handleSubmit}
                loading={submiting}
                text="Salvar"
              />
            </div>
            <div
              className="cursor-pointer text-red-600 hover:underline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Cancelar
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
