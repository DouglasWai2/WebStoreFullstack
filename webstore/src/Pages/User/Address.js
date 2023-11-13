import React, { useState } from "react";
import AddressCard from "../../components/User/Address/AddressCard";
import { refreshToken } from "../../helpers/getRefreshToken";
import { logOut } from "../../helpers/logOut";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();
  const [addressess, setAddressess] = useState([]);

  const getUserAddressess = async () => {
    const accessToken = window.localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/address/${accessToken}`,
        { withCredentials: true }
      );
      setAddressess(response.data);
    } catch (error) {
      if (error?.response.data === "Invalid Token") {
        try {
          await refreshToken();
          getUserAddressess();
        } catch (error) {
          if (
            error?.response.data === "Access Denied. No refresh token provided."
          ) {
            logOut();
          }
        }
      }
    }
  };

  useState(() => {
    getUserAddressess();
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
        return <AddressCard address={address} />;
      })}
    </div>
  );
};

export default Address;
