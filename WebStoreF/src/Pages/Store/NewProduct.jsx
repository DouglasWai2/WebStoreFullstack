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
import SubmitButton from "../../components/shared/UI/SubmitButton";
import ErrorCard from "../../components/shared/UI/ErrorCard";
import FeaturesInput from "../../components/Store/NewProduct/FeaturesInput";
import FormInput from "../../components/Store/NewProduct/FormInput";

const NewProduct = () => {
  const [tagsArray, setTagsArray] = useState([]);
  const [body, setBody] = useState(null);
  const [invalid, setInvalid] = useState(null);
  const [dropZone, setDropZone] = useState(false);
  const [dragging, setDragging] = useState(null);
  const navigate = useNavigate();
  const headers = {
    "content-type": "multipart/form-data",
  };
  const {
    data: response,
    loading,
    error,
    refresh,
  } = useFetchApi("/catalog/new-product", "POST", body, headers);
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
      weight: "",
      length: "",
      width: "",
      height: "",
    },
  });

  const { title, description, features, price, tags, files, brand, model } =
    product;

  // initial number of features input (1)
  const featuresInput = [
    {
      type: "text",
      id: "features." + 0,
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
          id: "features." + array.length,
          value: "",
        },
      ];
    });
  };

  const deleteFeature = (id) => {
    const newArray = array.filter((item) => item.id !== id);
    setArray(newArray);
  };

  function handleChange(e) {
    let changeName = e.target.name;
    let changeValue = e.target.value;
    let changeId = e.target.id;
    let dimensions;

    // Remove red border and invalid on input change
    e.target.classList.remove("invalid");
    e.target.classList.remove("!border-red-500");

    // Files are handled differently
    if (changeName === "files") changeValue = Array.from(e.target.files);

    // Format the price
    if (changeName === "price") changeValue = moneyMask(e.target.value);

    // Handle features
    if (changeName.includes("features")) {
      setArray((s) => {
        const newArr = s.slice();
        newArr.forEach((item) => {
          if (item.id == e.target.id) {
            item.value = e.target.value;
          }
        });
        return newArr;
      });
      changeName = null;
    }

    // Format dimensions values (weight, width, height and length)
    if (changeId.includes("dimensions")) {
      dimensions = {
        ...product.dimensions,
        [e.target.name]: parseFloat(e.target.value),
      };
      changeName = null;
    }

    setProduct((productInfo) =>
      changeName // If it is not dimensions change
        ? {
            ...productInfo,
            [changeName]: changeValue,
          }
        : { ...productInfo, dimensions: { ...dimensions } }
    );
  }

  useEffect(() => {
    setProduct((productInfo) => ({
      ...productInfo,
      features: array.map((item) => {
        return item.value;
      }),
    }));
  }, [array]); // Use effect necessary to handle async behavior of usestate callback

  const handleTagsArray = (e) => {
    if (e.key === ",") {
      setTagsArray([...tagsArray, e.target.value]);
      if (typeof tags === "string") product.tags = "";
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

    const {weight, width, height, length} = product.dimensions

    if (
      !title ||
      !description ||
      !price ||
      !brand ||
      !model ||
      !tags||
      !weight ||
      !width ||
      !height ||
      !length
    ) {
      Object.keys(product).map(item => {
        if (!product[item]) {
          const element = document.getElementById(item);
          if(element){
            element.classList.add("!border-red-500");
            element.classList.add("invalid");
          }
        }
      })
      Object.keys(product.dimensions).map(item => {
        if (!product.dimensions[item]) {
          const element = document.getElementsByName(item)[0];
          if(element){
            element.classList.add("!border-red-500");
            element.classList.add("invalid");
          }
        }
      })
      return setInvalid("Preencha todos os campos");
    }

    if (tagsArray.length < 3) {
      return setInvalid("Adicione pelo menos 3 etiquetas");
    }

    if (files.length === 0) {
      return setInvalid("Adicione pelo menos uma imagem");
    }

    setBody({
      ...product,
      tags: tagsArray,
      price: parseFloat(
        price.replace("R$ ", "").replace(".", "").replace(",", ".")
      ),
    });

    if (error) refresh();
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
    setDragging(null);
  }

  useEffect(() => {
    if (error) {
      setInvalid(error.data._message + ". Preencha os campos corretamente");
      Object.keys(error.data.errors).forEach((item) => {
        const element = document.getElementById(item);
        if (element) {
          element.classList.add("invalid");
          element.classList.add("!border-red-400");
        }
      });
    }

    if (response === "Product saved successfully") {
      navigate("/store/my-store");
    }
  }, [error, loading, response]);

  return (
    <div className="flex relative w-full justify-center py-10 px-10 gap-8 max-md:px-0 max-2xl:flex-col max-2xl:items-center">
      {invalid && (
        <div className="fixed z-40 top-3 translate-y-4 animate-expand">
          <ErrorCard invalid={invalid} handleClick={() => setInvalid("")} />
        </div>
      )}
      <form className="flex flex-col gap-3 shadow bg-white rounded w-2/5 py-5 px-8 max-2xl:w-full max-2xl:max-w-[1440px] max-md:gap-6">
        <FormInput
          props={{ id: "title" }}
          value={title || ""}
          name="title"
          label="Título"
          handleChange={handleChange}
        />
        <div className="relative my-2 z-20">
          <div className="absolute right-0 w-max h-max">
            <FontAwesomeIcon
              className="absolute right-0 m-2 peer"
              icon={faCircleInfo}
            />
            <div
              className="bg-white shadow-sm absolute right-[30px] top-[15px] w-[200px] 
            py-1 px-3 invisible opacity-0 peer-hover:visible 
            peer-hover:opacity-100 duration-300"
            >
              Especificações técnicas do produto, conteúdo da embalagem, guia de
              tamanhos, etc...
            </div>
          </div>
          <textarea
            placeholder=""
            id="description"
            className="floating-input-effect w-full peer !transition-[filter] min-h-[200px] max-h-[500px]"
            onChange={handleChange}
            value={description || ""}
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
        <FormInput
          props={{ id: "brand" }}
          value={brand || ""}
          name="brand"
          label="Marca"
          handleChange={handleChange}
        />
        <FormInput
          props={{ id: "model" }}
          value={model || ""}
          name="model"
          label="Modelo"
          handleChange={handleChange}
        />
        <span className="text-sm">
          Escreva características marcantes do seu produto
        </span>
        {array.map((item, i) => {
          const props = { item, i, deleteFeature, handleChange };
          return <FeaturesInput key={i} {...props} />;
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
            value={tags.replace(",", "") || ""}
            name="tags"
            id="tags"
            // placeholder="Ex: Eletrônicos, jogos, computador, videogame..."
            type="text"
          />
          <label className="floating-label max-md:!text-xs" htmlFor="tags">
            Etiquetas (para encontrarem seu produto)
          </label>
          <div className="text-xs text-right w-full text-gray-400">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
            Separe cada etiqueta por vírgula (',') para adicionar
          </div>
        </div>
        <FormInput
          props={{ id: "price" }}
          value={price || ""}
          name="price"
          label="Preço base"
          handleChange={handleChange}
        />
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
        <div className="">
          <h2 className="text-lg h-min">Dimensões da embalagem</h2>
          <p className="text-xs w-full h-min text-gray-400">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
            Considerando o produto dentro
          </p>
        </div>
        <FormInput
          value={product.dimensions.height}
          name="height"
          label="Altura (cm)"
          type="number"
          handleChange={handleChange}
          props={{ id: "dimensions.height" }}
        />
        <FormInput
          value={product.dimensions.length}
          name="length"
          label="Comprimento (cm)"
          type="number"
          handleChange={handleChange}
          props={{ id: "dimensions.length" }}
        />
        <FormInput
          value={product.dimensions.width}
          name="width"
          label="Largura (cm)"
          type="number"
          handleChange={handleChange}
          props={{ id: "dimensions.width" }}
        />
        <FormInput
          value={product.dimensions.weight}
          name="weight"
          label="Peso (kg)"
          type="number"
          handleChange={handleChange}
          props={{ id: "dimensions.weight" }}
        />
        <div className="h-[30px]">
          <SubmitButton
            loading={loading}
            text="Cadastrar Produto"
            onClick={handleSubmit}
          />
        </div>
      </form>
      <ProductPreview
        {...product}
        setDragging={setDragging}
        handleDrop={handleDrop}
        dragging={dragging}
      />
    </div>
  );
};

export default NewProduct;
