import React, { useState } from "react";
import AddressCard from "../../components/User/Address/AddressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {getUserAddressess} from "../../helpers/getUserAddress";
import { handleError } from "../../helpers/handleError";

const Address = () => {
  const navigate = useNavigate();
  const [addressess, setAddressess] = useState([]);

  async function awaitAddress(){
    try {
      const data = await getUserAddressess()
      setAddressess(data)     
    } catch (error) {
      handleError(error, awaitAddress)
    }
  }

 
  useState(() => {
    awaitAddress()
  }, []);

  return (
    <div className="w-full flex gap-5 flex-wrap">
      <div
        onClick={() => navigate("/user/new-address")}
        className="
      bg-white border-[1px] max-w-[250px] h-fit shadow-md p-3 flex items-center 
      gap-2 transition-all cursor-pointer duration-500 hover:brightness-75"
      >
        <h1>Adicionar novo endereço</h1>
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ color: "#94989e" }}
          size="2xl"
        />
      </div>
      {addressess.map((address) => {
        return <AddressCard key={address.nickname} address={address} />;
      })}
    </div>
  );
};

export default Address;
