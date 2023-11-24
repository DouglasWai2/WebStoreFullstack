import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { handleError } from "../../helpers/handleError";
import { Link, Outlet, useLocation } from "react-router-dom";

const MyStore = () => {
  const location = useLocation();
  const input = useRef();
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    storeDescription: "",
    storeImage: { link: "", name: "" },
    storeCategory: "",
    storeAddress: {
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const [loading, setLoading] = useState("");

  const getStoreInfo = async () => {
    const accessToken = window.localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/store/my-store/" + accessToken,
        { withCredentials: true }
      );

      setStoreInfo(response.data);

      console.log(response.data);
    } catch (error) {
      handleError(error, getStoreInfo);
    }
  };

  useEffect(() => {
    getStoreInfo();
  }, []);

  const setCpfCnpj = async () => {
    const accessToken = window.localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/store/set-id/" + accessToken,
        { cpfcnpj: input.current.value },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      handleError(error, setCpfCnpj);
    }
  };

  return location.pathname === "/store/my-store" ? (
    <main>
      {(storeInfo.cnpj && storeInfo.storeAddress) ||
      (storeInfo.cpf && storeInfo.storeAddress) ? (
        ""
      ) : (
        <p className="text-red-500">Conclua seu cadastro</p>
      )}
      <div className="w-1/4">
        <img src={storeInfo.storeImage.link} />
      </div>
      <div className="">
        <p>{storeInfo.storeName}</p>
        <p>Descrição</p>
        <p>{storeInfo.storeDescription}</p>
      </div>

      {storeInfo.cnpj ? (
        <p>CNPJ: {storeInfo.cnpj}</p>
      ) : storeInfo.cpf ? (
        <p>CPF: {storeInfo.cpf}</p>
      ) : (
        <>
          <label for="cpfcnpj">
            CPF/CNPJ
            <input ref={input} name="cpfcnpj" type="text" />
          </label>
          <button onClick={setCpfCnpj}>salvar</button>
        </>
      )}
      {!storeInfo.storeAddress ? (
        <Link to="address">Adicione o endereço da sua loja</Link>
      ) : (
        <p>
          {storeInfo.storeAddress.street} - {storeInfo.storeAddress.number} -{" "}
          {storeInfo.storeAddress.city} / {storeInfo.storeAddress.state}
        </p>
      )}
    </main>
  ) : (
    <Outlet />
  );
};

export default MyStore;
