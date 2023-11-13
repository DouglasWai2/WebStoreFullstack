import React from "react";
import axios from "axios";
import {
  faIdCard,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshToken } from "../../../helpers/getRefreshToken";
import { logOut } from "../../../helpers/logOut";

const AddressCard = ({ address }) => {
  async function setMainAddress(id) {
    const accessToken = window.localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:5000/api/address/set/${id}/${accessToken}`, {
        withCredentials: true,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error?.response.data === "Invalid Token") {
          try {
            refreshToken();
            setMainAddress();
          } catch (error) {
            console.log(error);
          }
          if (
            error?.response.data ===
              "Access Denied. No refresh token provided." ||
            error?.response.data === "Invalid Refresh Token"
          ) {
            logOut();
          }
        }
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
    </div>
  );
};

export default AddressCard;
