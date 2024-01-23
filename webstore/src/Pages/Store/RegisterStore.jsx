import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddressForm from "../../components/shared/AddressForm";
import SubmitButton from "../../components/shared/SubmitButton";

const RegisterStore = () => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    storeDescription: "",
    storeImage: "",
    storeCategory: "",
  });

  const [dropZone, setDropZone] = useState(false);
  const [imageLink, setImageLink] = useState("");

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
      if (e.target.files[0])
        setImageLink(URL.createObjectURL(e.target.files[0]));
    } else {
      setStoreInfo((storeInfo) => ({
        ...storeInfo,
        [e.target.name]: e.target.value,
      }));
    }
  }

  function handleOnDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    setStoreInfo((storeInfo) => ({
      ...storeInfo,
      storeImage: e.dataTransfer.files[0],
    }));
    setImageLink(URL.createObjectURL(e.dataTransfer.files[0]));
    setDropZone(false);
  }

  useEffect(() => {
    if (data === "Store registered succesfully") {
      window.location.pathname = "/store";
    }
  }, [data]);

  return (
    <div className="flex justify-center items-center h-full py-10">
      
      <div className="flex flex-col shadow gap-8 px-5 py-9 w-[500px]">
        <h1 className="text-3xl">Cadastre sua loja</h1>
        <form className="flex flex-col gap-3">
          <div className="relative mx-4 my-2 z-0">
            <input
              className="floating-input-effect peer"
              type="text"
              onChange={handleInputChange}
              value={storeName}
              name="storeName"
              id="storeName"
              placeholder=""
            />
            <label
              className="floating-label"
              htmlFor="storeName"
            >
              Nome da loja
            </label>
          </div>
          <div className="relative mx-4 my-2 z-0">
            <textarea
              id="storeDescription"
              name="storeDescription"
              value={storeDescription}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log(storeDescription);
                }
              }}
              placeholder=""
              className="floating-input-effect peer !transition-[filter] w-full min-h-[200px] max-h-[500px]"
            />
            <label
              className="floating-label"
              htmlFor="storeDescription"
            >
              Descrição
            </label>
          </div>
          <div className="mx-4 my-2 z-0 flex h-40">
            <label
              className={
                "w-full border-gray-300 border-[1px] p-4 flex flex-col items-center justify-center border-dashed hover:brightness-75 duration-200 bg-white cursor-pointer" +
                (dropZone ? " brightness-75" : "")
              }
              htmlFor="storeImage"
              name="storeImage"
              onDragOver={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDropZone(true);
              }}
              onDragLeave={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDropZone(false);
              }}
              onDrop={handleOnDrop}
            >
              {" "}
              <FontAwesomeIcon
                icon={faCloudArrowUp}
                className={dropZone ? "animate-bounce" : ""}
              />{" "}
              {dropZone ? (
                "Solte o arquivo para fazer upload"
              ) : (
                <>
                  Imagem da loja
                  <span className="text-xs">
                    Clique aqui ou arraste a imagem até esta área
                  </span>
                </>
              )}
              <input
                onChange={handleInputChange}
                hidden
                type="file"
                name="storeImage"
                id="storeImage"
                accept="image/*"
              />
            </label>
          </div>
        
          <div className="mx-4 my-2 z-0 flex flex-col">
            <label
              className="w-full left-2 !z-10 text-sm text-gray-500"
              htmlFor="storeCategory"
            >
              Em qual categoria sua loja mais se identifica?
            </label>
            <select
              className="border-[1px] w-full border-gray-300 p-2 peer placeholder-shown:focus:brightness-[0.9] duration-200"
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
          </div>
          <div className="px-4">
            <h3>Previsualização</h3>
            <div className="flex items-center border-[1px] border-gray-300 px-4 py-6">
              <div
                className="h-[150px] flex items-center justify-center
                  w-[150px] overflow-hidden rounded-full border-gray-300 border-[1px] border-dashed"
              >
                <img
                  alt={imageLink ? "Store Logo" : ""}
                  className="h-full w-full object-cover bg-gray-100"
                  src={imageLink}
                />
              </div>
              <p className="text-2xl ml-4">{storeInfo.storeName}</p>
            </div>
          </div>
          <div className="px-4">
             <SubmitButton loading={loading} text="Criar loja" onClick={(e) => {
                e.preventDefault();
                setBody(storeInfo);
              }} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStore;
