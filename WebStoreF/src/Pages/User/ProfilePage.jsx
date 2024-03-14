import { useEffect, useState } from "react";
import SkeletonData from "../../components/User/PersonalData/SkeletonPersonalData";
import TableData from "../../components/User/PersonalData/TableData";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import SubmitButton from "../../components/shared/SubmitButton";
import { formatPhoneNumber } from "../../helpers/formatPhoneNumber";
import { CPFMask } from "../../helpers/CPFMask";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [editForm, setEditForm] = useState(false);
  const [body, setBody] = useState(null);
  const [editData, setEditData] = useState(null);
  const {
    data: response,
    loading: submiting,
    error,
  } = useFetchApi("/user/update", "POST", body);

  const navigate = useNavigate();

  const { user, address, loading, refreshUser } = useOutletContext();

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

  const handleChange = (e, index) => {
    let newArr = [...userInfo];
    let changeValue = e.target.value;

    if (e.target.name === `CPF`) {
      changeValue = CPFMask(e.target.value);
    }

    if (e.target.name === `Celular`) {
      changeValue = formatPhoneNumber(e.target.value);
    }

    newArr[index][e.target.name] = changeValue;
    setUserInfo(newArr);

    setEditData((editData) =>
      e.target.name === `Celular` || e.target.name === `CPF`
        ? {
            ...editData,
            [newArr[index][`info`]]: changeValue.replace(/\D/g, ""),
          }
        : { ...editData, [newArr[index][`info`]]: changeValue }
    );
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
        {
          Celular: formatPhoneNumber(phone),
          info: "phone",
          type: "text",
          maxLength: 14,
        },
        { CPF: CPFMask(cpf) || "", info: "cpf", type: "text", maxLength: 14 },
        {
          "Data de Nascimento": formatedBirth || "",
          info: "birth",
          type: "date",
        },
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (response && !loading) {
      window.location.reload();
    }
  }, [response, error]);

  function handleSubmit() {
    setBody(editData);
  }

  return (
    <div className="w-full max-w-[1000px] border-[2px] rounded-md overflow-hidden shadow-md">
      {!user ? (
        <SkeletonData />
      ) : (
        <table className="w-full">
          <tbody className="w-full">
            {userInfo.map((item, index) => {
              return (
                <tr
                  key={Object.keys(item)[0]}
                  className="flex border-b-[1px] p-10 w-full max-sm:flex-col max-sm:px-0"
                >
                  <th className="flex text-start items-center w-[20%] max-sm:justify-center max-sm:w-full">
                    {Object.keys(item)[0]}:
                  </th>
                  <td className="w-full items-center flex justify-between max-sm:flex-col max-sm:justify-normal max-sm:items-center max-sm:gap-3">
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
            <tr className="flex border-b-[1px] p-10 w-full max-sm:flex-col">
              <th className="flex text-start items-center w-[20%] max-sm:w-full max-sm:justify-center">
                Endereço
              </th>
              <td className="w-full items-center flex justify-between max-sm:justify-normal max-sm:gap-3 max-sm:items-center">
                <div className="ml-5">
                  {address && address.length ? (
                    address[0].street + " - N° " + address[0].number
                  ) : (
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => navigate("/user/address")}
                    >
                      Adicione um endereço
                    </span>
                  )}
                </div>
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
            <button
              className="cursor-pointer bg-red-500 shadow-sm w-full rounded-md text-black hover:brightness-75"
              onClick={() => {
                setEditForm(false);
                setEditData(null);
                refreshUser();
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
