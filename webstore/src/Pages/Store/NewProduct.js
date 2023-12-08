import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTag } from "@fortawesome/free-solid-svg-icons";
import useMousePosition from "../../helpers/useMousePosition";

const NewProduct = () => {
  // initial number of features input (1)
  const featuresInput = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];

  const [array, setArray] = useState(featuresInput); // array to modify the number of features input
  const [tagsArray, setTagsArray] = useState([]);

  const navigate = useNavigate();

  const addFeature = (e) => {
    e.preventDefault();
    setArray((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState(null);
  const [dropZone, setDropZone] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [mainImage, setMainImage] = useState("");

  const mousePosition = useMousePosition();

  const [style, setStyle] = useState({
    left:"0px",
    top: "0px",
  });


  const headers = {
    "content-type": "multipart/form-data",
  };

  const {
    data: response,
    loading,
    error,
  } = useFetchApi("/api/catalog/new-product", "POST", body, headers);

  function handleTitle(e) {
    setTitle(e.target.value);
  }
  function handleDescription(e) {
    setDescription(e.target.value);
  }
  function handleFeatures(e) {
    const index = e.target.id;
    setArray((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
    setFeatures(array.map((item) => item.value));
  }
  function handleTags(e) {
    setTags(e.target.value);
  }
  function handleFiles(e) {
    setFiles(e.target.files);
  }
  function handleBrand(e) {
    setBrand(e.target.value);
  }
  function handleModel(e) {
    setModel(e.target.value);
  }

  const handleTagsArray = (e) => {
    if (e.key === ",") {
      setTagsArray([...tagsArray, e.target.value]);
      setTags("");
      e.target.value = "";
    }
  };

  const handleClick = (item) => {
    const newArr = tagsArray.filter((element) => {
      return element !== item;
    });
    setTagsArray(newArr);
  };

  function handleOnDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handleFiles(e);
    setImageLink(URL.createObjectURL(e.dataTransfer.files[0]));
    setDropZone(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBody({
      description,
      title,
      features,
      tags: [...tagsArray, tags],
      files,
      brand,
      model,
    });
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (response === "Product saved successfully") {
      navigate("/store/my-store");
    }
  }, [error, response]);

  return (
    <div className="flex justify-center items-center py-10 gap-8">
      <form className="flex shadow">
        <div className="flex flex-col gap-3">
          <div className="relative mx-4 my-2 z-0">
            <input
              className="floating-input-effect peer"
              onChange={handleTitle}
              value={title}
              name="title"
              type="text"
              placeholder=""
            />
            <label className="floating-label" htmlFor="title">
              Título
            </label>
          </div>
          <div className="relative mx-4 my-2 z-0">
            <textarea
              placeholder=""
              className="floating-input-effect peer !transition-[filter] w-full min-h-[200px] max-h-[500px]"
              onChange={handleDescription}
              value={description}
              name="description"
              type="text"
            />
            <label className="floating-label" htmlFor="description">
              Descrição do produto
            </label>
          </div>
          <div className="relative mx-4 my-2 z-0">
            <input
              placeholder=""
              className="floating-input-effect peer"
              onChange={handleBrand}
              value={brand}
              name="brand"
              type="text"
            />
            <label className="floating-label" htmlFor="brand">
              Marca
            </label>
          </div>
          <div className="relative mx-4 my-2 z-0">
            <input
              placeholder=""
              className="floating-input-effect peer"
              onChange={handleModel}
              value={model}
              name="model"
              type="text"
            />
            <label className="floating-label" htmlFor="model">
              Modelo
            </label>
          </div>
          Escreva caracteríscas marcantes do seu produto
          {array.map((item, i) => {
            return (
              <div className="relative mx-4 my-2 z-0">
                <input
                  placeholder=""
                  className="floating-input-effect peer"
                  name="features"
                  onChange={handleFeatures}
                  value={item.value}
                  id={i}
                  type={item.type}
                  size="40"
                  key={i}
                />
                <label className="floating-label" htmlFor="features">
                  Característica
                </label>
              </div>
            );
          })}
          <button onClick={addFeature}>+</button>
          {tagsArray.map((item) => {
            return (
              <div
                className="bg-gray-300 text-white w-fit rounded-full px-4 py-1 flex gap-2 items-center "
                key={item}
              >
                <FontAwesomeIcon className="text-white" icon={faTag} />
                {item}
                <button
                  className="text-white"
                  onClick={() => handleClick(item)}
                >
                  X
                </button>
              </div>
            );
          })}
          <div className="relative mx-4 my-2 z-0">
            <input
              placeholder=""
              className="floating-input-effect peer"
              onKeyDown={handleTagsArray}
              onChange={handleTags}
              value={tags.replace(",", "")}
              name="tags"
              // placeholder="Ex: Eletrônicos, jogos, computador, videogame..."
              type="text"
            />
            <label className="floating-label" htmlFor="tags">
              Etiquetas (para encontrarem seu produto)
            </label>
          </div>
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
                Imagens do produto
                <span className="text-xs">
                  Clique aqui ou arraste a imagem até esta área
                </span>
              </>
            )}
            <input
              onChange={handleFiles}
              hidden
              multiple="multiple"
              type="file"
              name="storeImage"
              id="storeImage"
              accept="image/*"
            />
          </label>
        </div>
        {/* <label htmlFor="files">
          Imagens
          <input
            onChange={handleFiles}
            name="files"
            type="file"
            multiple="multiple"
          />
        </label> */}
        <button onClick={handleSubmit}>submit</button>
      </form>
      <div className="shadow p-4 flex">
        <div id="images-container" className="">
          {files.length ? (
            <div
            onMouseOver={() => 
              setStyle({
              left: mousePosition.x - 150 + "px",
              top: mousePosition.y - 150 + "px",
            })}
            className="bg-white h-[433px] w-[578px] overflow-hidden hover:brightness-75 transition-[filter] duration-100">
              <div
              style={style}
              
                id="image-zoom"
                className={
                  "absolute h-[300px] w-[300px] bg-white opacity-60 z-10 left-[100px]"
                }
              ></div>
              <img     
                className="object-contain h-full w-full"
                src={
                  mainImage
                    ? mainImage
                    : URL.createObjectURL(Object.values(files)[0])
                }
              />
            </div>
          ) : (
            <div className="bg-gray-200 h-[433px] text-gray-400 text-3xl flex justify-center items-center w-[578px] overflow-hidden hover:brightness-75 transition-[filter] duration-100">
              <p>1</p>
            </div>
          )}
          <div className="flex w-[578px] h-[] overflow-x-scroll gap-3 my-4 product-images">
            {files.length ? (
              Object.values(files).map((item) => {
                return (
                  <div
                    onMouseOver={() => {
                      setMainImage(URL.createObjectURL(item));
                    }}
                    className="w-[106px] h-[130px] overflow-hidden bg-white hover:brightness-75 transition-[filter] duration-100"
                  >
                    <img
                      className="!object-contain h-full w-full"
                      src={URL.createObjectURL(item)}
                    />
                  </div>
                );
              })
            ) : (
              <>
                {" "}
                <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  1
                </div>
                <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  2
                </div>
                <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  3
                </div>
                <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  4
                </div>
                <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  5
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-[578px] flex flex-col gap-3">
          <h1 className="text-3xl">Samsung Galaxy S8</h1>
          <h3 className="text-xl">Características</h3>
          <ul className="list-disc ml-7">
            <li className="text-sm">
              Dispositivo desbloqueado para que você escolha a companhia
              telefônica de sua preferência.
            </li>
            <li className="text-sm">Tela Super AMOLED de 5.8".</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
