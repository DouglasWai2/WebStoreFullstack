import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCloudArrowUp, faQuestion, faTag } from "@fortawesome/free-solid-svg-icons";
import ProductPreview from "../../components/Store/ProductPreview";
import { moneyMask } from "../../helpers/moneyMask";
import SubmitButton from "../../components/shared/SubmitButton";

const NewProduct = () => {

  const [tagsArray, setTagsArray] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState(null);
  const [dropZone, setDropZone] = useState(false);
  const navigate = useNavigate();

  // initial number of features input (1)
  const featuresInput = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];
  const [array, setArray] = useState(featuresInput); // array to modify the number of features input

  const addFeature = (e) => {
    e.preventDefault();
    setArray((s) => {
      return [
        ...s,
        {
          type: "text",
          id: array.length + 1,
          value: "",
        },
      ];
    });
  };

  const deleteFeature= (id)=> {
    const newArray = array.filter(item => item.id !== id)
    console.log(array)
    setArray(newArray);
  }

  const headers = {
    "content-type": "multipart/form-data",
  };

  const {
    data: response,
    loading,
    error,
  } = useFetchApi("/api/catalog/new-product", "POST", body, headers);



  useEffect(() => {
    setFeatures(
      array.map((item) => {
        return item.value;
      })
    );
  }, [array]); // Use effect necessary to handle async behavior of usestate callback

  function handleTitle(e) {
    setTitle(e.target.value);
  }
  function handleDescription(e) {
    setDescription(e.target.value);
  }
  function handleFeatures(e) {
    setArray((s) => {
      const newArr = s.slice();
      newArr.forEach(item => {
        if(item.id == e.target.id){
          item.value = e.target.value
        }
      })
      return newArr;
    });
  }
  function handleTags(e) {
    setTags(e.target.value);
  }
  function handlePrice(e) {
    setPrice(moneyMask(e.target.value));
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
    setFiles(e.dataTransfer.files);
    setDropZone(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBody({
      description,
      title,
      features,
      tags: [...tagsArray, ...tags],
      files,
      brand,
      model,
      price: parseFloat(price.replace('R$ ', '').replace(',', '.'))
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
    <div className="flex justify-center py-10 gap-8">
      <form className="flex shadow w-1/2 py-5 px-4 ">
        <div className="flex flex-col gap-3 w-full">
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
            <FontAwesomeIcon
              className="absolute right-0 m-2 peer"
              icon={faCircleInfo} />
            <div className="bg-white shadow-sm absolute z-40 left-[100%] w-max py-1 px-3 invisible opacity-0 peer-hover:visible peer-hover:opacity-100 duration-300">
              Especificações técnicas do produto, conteúdo da embalagem, etc...
            </div>
            <textarea
              placeholder=""
              className="floating-input-effect peer !transition-[filter] w-full min-h-[200px] max-h-[500px]"
              onChange={handleDescription}
              value={description}
              name="description"
              type="text"
              aria-multiline={true}
            />
            <label className="floating-label flex w-max gap-3" htmlFor="description">
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
              <div key={i} className="relative mx-4 my-2 z-0">
                <button onClick={(e) => {
                  e.preventDefault()
                  deleteFeature(item.id)
                  }} className="absolute right-0">X</button>
                <input
                  placeholder=""
                  className="floating-input-effect peer"
                  name="features"
                  onChange={handleFeatures}
                  value={item.value}
                  id={item.id}
                  type={item.type}
                  size="40"
                />
                <label className="floating-label" htmlFor="features">
                  Característica {i + 1}
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
          <div className="relative mx-4 my-2 z-0">
            <input
              placeholder=""
              className="floating-input-effect peer"
              onChange={handlePrice}
              value={price}
              name="price"
              type="text"
            />
            <label className="floating-label" htmlFor="price">
              Preço base
            </label>
          </div>
          <div className="mx-4 my-2 z-0 flex h-40">
            <label
              className={
                "w-full border-gray-300 border-[1px] p-4 flex flex-col items-center justify-center border-dashed hover:brightness-75 duration-200 bg-white cursor-pointer text-center" +
                (dropZone && " brightness-75")
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
                  <span className="text-xs text-center">
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
          <SubmitButton loading={loading} text='Cadastrar Produto' onClick={handleSubmit} />
        </div>
      </form>
      <ProductPreview
        description={description}
        features={features}
        title={title}
        files={files}
        price={price}
      />
    </div>
  );
};

export default NewProduct;
