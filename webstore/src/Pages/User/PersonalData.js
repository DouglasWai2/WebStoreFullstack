import { useEffect, useState } from "react";
import SkeletonData from "../../components/User/PersonalData/SkeletonPersonalData";
import TableData from "../../components/User/PersonalData/TableData";
import { useOutletContext } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import { CPFMask } from "../../helpers/CPFMask";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState([
    { Nome: "" },
    { "Ultimo Nome": "" },
    { Email: "" },
    { Celular: "" },
    { CPF: "" },
    { "Data de Nascimento": "" },
  ]);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const { data: response, loading } = useFetchApi(
    "/api/user/update",
    "POST",
    editData
  );

  const { data, address } = useOutletContext();



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
    let newArr = [...userInfo];
    newArr[index][e.target.name] = e.target.value;
    setUserInfo(newArr);
  };

  useEffect(() => {
    if (data) {
      const { name, lastName, email, phone, cpf, birth } = data;
      let formatedBirth;
      if (birth) {
        formatedBirth = formatDate(birth);
      }
      setUserInfo([
        { Nome: name, value: varToString({ name }) },
        { "Ultimo Nome": lastName, value: varToString({ lastName }) },
        { Email: email, value: varToString({ email }) },
        { Celular: phone, value: varToString({ phone }) },
        { CPF: cpf || "", value: varToString({ cpf }) },
        {
          "Data de Nascimento": formatedBirth || "",
          value: varToString({ birth }),
        },
      ]);
    }

    if (response && !loading) {
      window.location.reload();
    }
  }, [data, response]);

  function handleSubmit() {
    const { CPF } = userInfo[4]
    parseInt(CPF)
    
  }

  return (
    <div className="w-[80%] border-[2px] rounded-md overflow-hidden shadow-md">
      {!data && !address ? (
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
            <tr className="flex border-b-[1px] p-10 w-full">
              <th className="flex text-start items-center w-[20%]">Endereço</th>
              <td className="w-full items-center flex justify-between">
                <span className="ml-5">{address.length ? address[0].street + ' - N° ' + address[0].number : 'Adicione um endereço'}</span>
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
          <button
            onClick={handleSubmit}
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
