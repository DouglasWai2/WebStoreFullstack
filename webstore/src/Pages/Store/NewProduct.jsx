import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCloudArrowUp,
  faPlus,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import ProductPreview from "../../components/Store/ProductPreview";
import { moneyMask } from "../../helpers/moneyMask";
import SubmitButton from "../../components/shared/SubmitButton";
import ErrorCard from "../../components/shared/ErrorCard";

const NewProduct = () => {
  const [tagsArray, setTagsArray] = useState([]);
  const [body, setBody] = useState(null);
  const [invalid, setInvalid] = useState(null);
  const [dropZone, setDropZone] = useState(false);
  const [dragging, setDragging] = useState(null);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    features: [],
    price: "",
    tags: "",
    files: [],
    brand: "",
    model: "",
    dimensions: {
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    },
  });

  const { title, description, features, price, tags, files, brand, model } =
    product;

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

  const deleteFeature = (id) => {
    const newArray = array.filter((item) => item.id !== id);
    setArray(newArray);
  };

  const headers = {
    "content-type": "multipart/form-data",
  };

  const {
    data: response,
    loading,
    error,
  } = useFetchApi("/catalog/new-product", "POST", body, headers);

  useEffect(() => {
    setProduct((productInfo) => ({
      ...productInfo,
      features: array.map((item) => {
        return item.value;
      }),
    }));
  }, [array, tagsArray]); // Use effect necessary to handle async behavior of usestate callback

  function handleChange(e) {
    if (e.target.name === "files") {
      setProduct((productInfo) => ({
        ...productInfo,
        files: Array.from(e.target.files),
      }));
    } else if (e.target.name === "price") {
      setProduct((productInfo) => ({
        ...productInfo,
        price: moneyMask(e.target.value),
      }));
    } else if (e.target.name.includes("features")) {
      setArray((s) => {
        const newArr = s.slice();
        newArr.forEach((item) => {
          if (item.id == e.target.id) {
            item.value = e.target.value;
          }
        });
        return newArr;
      });
    } else {
      setProduct((productInfo) => ({
        ...productInfo,
        [e.target.name]: e.target.value,
      }));
    }
  }

  useEffect(() => {
    setProduct((productInfo) => ({
      ...productInfo,
      features: array.map((item) => {
        return item.value;
      }),
    }));
  }, [array, tagsArray]); // Use effect necessary to handle async behavior of usestate callback

  const handleTagsArray = (e) => {
    if (e.key === ",") {
      setTagsArray([...tagsArray, e.target.value]);
      product.tags = "";
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
    setProduct((productInfo) => ({
      ...productInfo,
      [e.target.name]: Array.from(e.target.files),
    }));
    setDropZone(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBody({
      description,
      title,
      features,
      tags: tagsArray,
      files,
      brand,
      model,
      price: parseFloat(
        price.replace("R$ ", "").replace(".", "").replace(",", ".")
      ),
    });
  };

  function handleDrop(result) {
    if (!result.destination) return;

    const items = files;
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProduct((productInfo) => ({
      ...productInfo,
      files: items,
    }));
  }

  useEffect(() => {
    if (error) {
      setInvalid("Preencha todos os campos corretamente");
      Object.keys(error.response.data.errors).forEach((item) => {
        const element = document.getElementsByName(item);
        if (element[0]) {
          element[0].className += " invalid !border-red-400";
        }
      });
    }

    if (response === "Product saved successfully") {
      navigate("/store/my-store");
    }
  }, [error, response]);

  return (
    <div className="flex justify-center py-10 px-10 gap-8">
      {invalid && (
        <div className="absolute z-20 translate-y-4">
          <ErrorCard invalid={invalid} handleClick={() => setInvalid("")} />
        </div>
      )}
      <form className="flex flex-col gap-3 shadow w-2/5 py-5 px-8 ">
        <div className="relative  my-2 z-0">
          <input
            className="floating-input-effect w-full peer"
            onChange={handleChange}
            value={title}
            name="title"
            type="text"
            placeholder=""
            required={true}
          />
          <label className="floating-label" htmlFor="title">
            Título
          </label>
        </div>
        <div className="relative  my-2 z-10">
          <FontAwesomeIcon
            className="absolute right-0 m-2 peer"
            icon={faCircleInfo}
          />
          <div className="bg-white shadow-sm absolute left-[100%] w-[200px] py-1 px-3 invisible opacity-0 peer-hover:visible peer-hover:opacity-100 duration-300">
            Especificações técnicas do produto, conteúdo da embalagem, guia de
            tamanhos, etc...
          </div>
          <textarea
            placeholder=""
            className="floating-input-effect w-full peer !transition-[filter] min-h-[200px] max-h-[500px]"
            onChange={handleChange}
            value={description}
            name="description"
            type="text"
            aria-multiline={true}
            required
          />
          <label
            className="floating-label flex w-max gap-3"
            htmlFor="description"
          >
            Descrição do produto
          </label>
        </div>
        <div className="relative my-2 z-0">
          <input
            placeholder=""
            className={"floating-input-effect w-full peer "}
            onChange={handleChange}
            value={brand}
            name="brand"
            type="text"
            required
          />
          <label className="floating-label" htmlFor="brand">
            Marca
          </label>
        </div>
        <div className="relative my-2 z-0">
          <input
            placeholder=""
            className="floating-input-effect w-full peer"
            onChange={handleChange}
            value={model}
            name="model"
            type="text"
          />
          <label className="floating-label" htmlFor="model">
            Modelo
          </label>
        </div>
        <span className="text-sm">
          Escreva caracteríscas marcantes do seu produto
        </span>
        {array.map((item, i) => {
          return (
            <div key={i} className="relative my-2 z-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteFeature(item.id);
                }}
                className="absolute h-full px-2 right-0"
              >
                X
              </button>
              <input
                placeholder=""
                className="floating-input-effect w-full peer"
                name={"features." + i}
                onChange={handleChange}
                value={item.value}
                id={item.id}
                type={item.type}
                size="40"
                required
              />
              <label className="floating-label" htmlFor="features">
                Característica {i + 1}
              </label>
            </div>
          );
        })}
        <div className="flex items-center justify-center text-sm">
          <div
            className="flex items-center justify-center group cursor-pointer gap-2"
            onClick={addFeature}
          >
            Adicionar característca
            <button
              className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-black group-hover:scale-110 
        group-hover:rotate-180 group-hover:rounded-sm transition-transform duration-200 ease-out"
            >
              <FontAwesomeIcon className="text-white" icon={faPlus} />
            </button>
          </div>
        </div>
        {tagsArray.map((item) => {
          return (
            <div
              className="bg-gray-300 text-white w-fit rounded-full px-4 py-1 flex gap-2 items-center "
              key={item}
            >
              <FontAwesomeIcon className="text-white" icon={faTag} />
              {item}
              <button className="text-white" onClick={() => handleClick(item)}>
                X
              </button>
            </div>
          );
        })}
        <div className="relative  my-2 z-0">
          <input
            placeholder=""
            className="floating-input-effect w-full peer"
            onKeyDown={handleTagsArray}
            onChange={handleChange}
            value={tags.replace(",", "")}
            name="tags"
            // placeholder="Ex: Eletrônicos, jogos, computador, videogame..."
            type="text"
          />
          <label className="floating-label" htmlFor="tags">
            Etiquetas (para encontrarem seu produto)
          </label>
          <div className="text-xs text-right w-full text-gray-400">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
            Separe cada etiqueta por vírgula (',') para adicionar
          </div>
        </div>
        <div className="relative  my-2 z-0">
          <input
            placeholder=""
            className="floating-input-effect w-full peer"
            onChange={handleChange}
            value={price}
            name="price"
            type="text"
            required
          />
          <label className="floating-label" htmlFor="price">
            Preço base
          </label>
        </div>
        <div className=" my-2 z-0 flex h-40">
          <label
            className={
              "w-full border-gray-300 border-[1px] p-4 flex flex-col items-center justify-center border-dashed hover:brightness-75 duration-200 bg-white cursor-pointer text-center" +
              (dropZone && " brightness-75")
            }
            htmlFor="files"
            name="files"
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
              onChange={handleChange}
              hidden
              multiple="multiple"
              type="file"
              name="files"
              id="files"
              accept="image/*"
            />
          </label>
        </div>
        <div className="h-[30px]">
          <SubmitButton
            loading={loading}
            text="Cadastrar Produto"
            onClick={handleSubmit}
          />
        </div>
      </form>
      <ProductPreview
        description={description}
        features={features}
        title={title}
        files={files}
        price={price}
        setDragging={setDragging}
        handleDrop={handleDrop}
        dragging={dragging}
      />
    </div>
  );
};

export default NewProduct;
