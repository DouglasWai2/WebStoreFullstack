import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { handleError } from "../../helpers/handleError";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetch";

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
  // const [loading, setLoading] = useState("");

  const { data, loading, error } = useFetchApi("/api/store/my-store", "GET");

  useEffect(() => {
    if (data) {
      setStoreInfo(data);
    }
  }, [data, error]);

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
          <label htmlFor="cpfcnpj">
            CPF/CNPJ
            <input ref={input} name="cpfcnpj" type="text" />
          </label>
          <button onClick={setCpfCnpj}>salvar</button>
        </>
      )}
      {Object.keys(storeInfo.storeAddress).length === 0 ? (
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
