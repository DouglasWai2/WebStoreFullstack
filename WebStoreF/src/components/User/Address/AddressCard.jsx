import React, { useEffect, useState } from "react";
import {
  faIdCard,
  faLocationDot,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchApi } from "../../../hooks/useFetchApi";
import { useOutletContext } from "react-router-dom";

const AddressCard = ({ address }) => {
  const [url, setUrl] = useState(null);

  const { refreshUser } = useOutletContext()

  const { data, loading, error } = useFetchApi(url, "GET");

  useEffect(() => {
    if (data) {
      refreshUser()
      setUrl(null)
    }

    if(error) console.log(error)
  }, [data, error]);

  return (
    <div className="border-[1px] bg-white rounded-sm 
    flex flex-col gap-5 p-4 w-[275px] shadow-sm justify-between">
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
            onClick={() => setUrl("/user/address/set/" + address._id)}
            className="bg-yellow-300 w-full px-3 hover:bg-yellow-400"
          >
            Definir como principal
          </button>
        )}
        <button
          onClick={() => setUrl("/user/address/delete/" + address._id)}
          className="w-max text-red-500 px-2"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
