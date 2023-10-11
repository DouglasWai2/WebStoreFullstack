import React from "react";
import AddressCard from "./AddressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const Address = () => {
  return (
    <div className="w-full flex gap-5 flex-wrap">
      <div className="bg-white border-[1px] w-[250px] h-[100px] shadow-md p-3 flex items-center gap-2 transition-all cursor-pointer duration-500 hover:brightness-75">
        <h1>Adicionar novo endereço</h1>
        <FontAwesomeIcon
          icon={faCirclePlus}
          style={{ color: "#94989e" }}
          size="2xl"
        />
      </div>
      <AddressCard />
    </div>
  );
};

export default Address;
