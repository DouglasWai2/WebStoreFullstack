import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";

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
  const [body, setBody] = useState(null);

  const { data, loading, error } = useFetchApi("/api/store/my-store", "GET");
  const { data: response } = useFetchApi("/api/store/set-id", "POST", body);

  useEffect(() => {
    if (data) {
      setStoreInfo(data);
    }
    if (response) {
      console.log("teste");
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, response]);

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
          <button onClick={() => setBody({ cpfcnpj: input.current.value })}>
            salvar
          </button>
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
