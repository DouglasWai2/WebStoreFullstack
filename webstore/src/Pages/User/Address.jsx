import React, { useState } from "react";
import AddressCard from "../../components/User/Address/AddressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import SkeletonAddressCard from "../../components/User/Address/SkeletonAddressCard";

const Address = () => {
  const navigate = useNavigate();
  const { address, fetching } = useOutletContext();

  return (
    <div className="w-full flex gap-5 flex-wrap px-20 max-md:px-0 max-md:justify-center">
      {address ? (
        address.length === 0 ? (
          ""
        ) : (
          address.map((address) => {
            return <AddressCard key={address.nickname} address={address} />;
          })
        )
      ) : (
        <SkeletonAddressCard />
      )}
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
    </div>
  );
};

export default Address;
