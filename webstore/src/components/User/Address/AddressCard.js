import React from "react";
import axios from "axios";
import {
  faIdCard,
  faLocationDot,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleError } from "../../../helpers/handleError";

const AddressCard = ({ address }) => {
  async function setMainAddress(id) {
    const accessToken = window.localStorage.getItem("accessToken");
    try {
      await axios.get(
        `http://localhost:5000/api/address/set/${id}/${accessToken}`,
        {
          withCredentials: true,
        }
      );

      window.location.reload();
    } catch (error) {
      handleError(error, function(){
        setMainAddress(id)
      })
    }
  }

  async function deleteAddress(id) {
    const accessToken = window.localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:5000/api/address/delete/${id}/${accessToken}`, {
        withCredentials: true,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        handleError(error, function () {
          deleteAddress(id);
        });
      });
  }

  return (
    <div className="border-[1px] flex flex-col gap-5 p-4 w-[250px] shadow-md">
      <p>
        <span className="font-semibold">
          {address.nickname ? address.nickname : address.recieverName}{" "}
        </span>{" "}
      </p>
      <p>
        <span className="font-semibold flex gap-3 items-center">
          <FontAwesomeIcon icon={faLocationDot} />
          Endereço:{" "}
        </span>
        {`${address.street} - ${address.number} - ${address.city}/${address.state}`}
      </p>
      <p>
        <span className="font-semibold flex gap-3 items-center">
          <FontAwesomeIcon icon={faUser} />
          Destinatário:
        </span>{" "}
        {address.recieverName}
      </p>

      <p>
        <span className="font-semibold flex gap-3 items-center">
          <FontAwesomeIcon icon={faIdCard} />
          CPF:
        </span>
        {address.CPF}
      </p>
      <div className="flex justify-between">
        {address.main ? (
          <p>Endereço selecionado</p>
        ) : (
          <button
            onClick={() => setMainAddress(address.id)}
            className="bg-yellow-300 w-full h-fit px-3 hover:bg-yellow-400"
          >
            Definir como principal
          </button>
        )}
        <button
          onClick={() => deleteAddress(address.id)}
          className="w-max text-red-500 px-2"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
