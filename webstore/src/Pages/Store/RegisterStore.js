import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";

const RegisterStore = () => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    storeDescription: "",
    storeImage: "",
    storeCategory: "",
  });
  const { storeName, storeDescription, storeImage, storeCategory } = storeInfo;
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const [body, setBody] = useState(null);
  const { data, loading, error } = useFetchApi(
    "/api/store/register-store",
    "POST",
    body,
    headers
  );

  const navigate = useNavigate();

  const options = [
    { option: "Selecione uma categoria", value: "" },
    { option: "Acessórios automotivos", value: "Acessórios automotivos" },
    { option: "Alimentos e bebidas", value: "Alimentos e bebidas" },
    { option: "Brinquedos", value: "Brinquedos" },
    { option: "Casa e decoração", value: "Casa e decoração" },
    {
      option: "Equipamentos de escritório",
      value: "Equipamentos de escritório",
    },
    { option: "Games", value: "Games" },
    { option: "Informática", value: "Informática" },
    { option: "Jóias e Relógios", value: "Jóias e Relógios" },
    { option: "Mídia", value: "Mídia" },
    { option: "Moda", value: "Moda" },
    { option: "Perfumaria e cosméticos", value: "Perfumaria e cosméticos" },
    { option: "Produtos para pets", value: "Produtos para pets" },
    { option: "Saúde e bem-estar", value: "Saúde e bem-estar" },
    { option: "Serviços digitais", value: "Serviços digitais" },
    { option: "Utensílios domésticos", value: "Utensílios domésticos" },
  ];

  function handleInputChange(e) {
    if (e.target.type === "file") {
      setStoreInfo((storeInfo) => ({
        ...storeInfo,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setStoreInfo((storeInfo) => ({
        ...storeInfo,
        [e.target.name]: e.target.value,
      }));
    }
  }

  useEffect(() => {
    if (data === "Store registered succesfully") {
      window.location.pathname = "/store";
    }
  }, [data]);

  return (
    <main>
      <h1>Cadastre sua loja</h1>
      <form>
        <label htmlFor="storeName">
          {" "}
          Nome da loja
          <input
            onChange={handleInputChange}
            value={storeName}
            name="storeName"
            id="storeName"
            placeholder="Este nome será único"
          />
        </label>
        <label htmlFor="storeDescription">
          {" "}
          Descrição
          <input
            onChange={handleInputChange}
            value={storeDescription}
            name="storeDescription"
            id="storeDescription"
            placeholder="Conte um pouco sobre a sua loja..."
          />
        </label>
        <label htmlFor="storeImage">
          {" "}
          Imagem da loja
          <input
            onChange={handleInputChange}
            type="file"
            name="storeImage"
            id="storeImage"
          />
        </label>
        <label htmlFor="storeCategory">
          Em qual categoria sua loja mais se identifica?
          <select
            onChange={handleInputChange}
            value={storeCategory}
            name="storeCategory"
          >
            {options.map((item) => {
              return (
                <option key={item.value} value={item.value}>
                  {item.option}
                </option>
              );
            })}
          </select>
        </label>
        <button onClick={(e) => {
          e.preventDefault()
          setBody(storeInfo)}}>Criar loja</button>
      </form>
    </main>
  );
};

export default RegisterStore;
