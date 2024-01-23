import React, { useEffect, useState } from "react";
import {
  faIdCard,
  faLocationDot,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchApi } from "../../../hooks/useFetchApi";

const AddressCard = ({ address }) => {
  const [url, setUrl] = useState(null);

  const { data, loading, error } = useFetchApi(url, "GET");

  useEffect(() => {
    if (data === "Main address altered successfully") {
      window.location.reload();
    }
  }, [data]);

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
        {`${address.street} - ${address.number} - ${address.city}/${address.state}`}{" "}
        <br></br>
        <span>CEP: {address.cep}</span>
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
            onClick={() => setUrl("/api/address/set/" + address.id)}
            className="bg-yellow-300 w-full h-fit px-3 hover:bg-yellow-400"
          >
            Definir como principal
          </button>
        )}
        <button
          onClick={() => setUrl("/api/address/delete/" + address.id)}
          className="w-max text-red-500 px-2"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
