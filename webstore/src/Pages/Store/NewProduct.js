import React, { useState } from "react";
import axios from "axios";
import { handleError } from "../../helpers/handleError";

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
  const [tags, setTags] = useState([]);


  const addFeature = () => {
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

  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
    features: [],
    tags: "",
    files: [],
    brand: "",
    model: "",
  });

  function handleInputChange(e) {
    if (e.target.type === "file") {
      setProductInfo((productInfo) => ({
        ...productInfo,
        [e.target.name]: e.target.files,
      }));
    } else if (e.target.name === "features") {
      const index = e.target.id;
      setArray((s) => {
        const newArr = s.slice();
        newArr[index].value = e.target.value;

        return newArr;
      });
      setProductInfo((productInfo) => ({
        ...productInfo,
        features: array.map((item) => item.value),
      }));
    } else if (e.target.name === "tags") {
      setProductInfo((productInfo) => ({
        ...productInfo,
        tags: e.target.value.replace(",", ""),
      }));
    } else {
      setProductInfo((productInfo) => ({
        ...productInfo,
        [e.target.name]: e.target.value,
      }));
      console.log(productInfo);
    }
  }

  const handleTags = async (e) => {
    if (e.key === ",") {
      await setTags((s) => [...s, e.target.value]);
      await setProductInfo((s) => ({ ...s, tags: "" }));
      e.target.value = "";
    }
  };

  const handleClick = (item) => {
    console.log(item);
    const newArr = tags.filter((element) => {
      return element !== item;
    });
    setTags(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = window.localStorage.getItem("accessToken");
    await setProductInfo((productInfo) => ({
      ...productInfo,
      tags,
    }));

    console.log(productInfo);

    
    try {
      await axios.post(
        `http://localhost:5000/api/catalog/new-product/${accessToken}`,
        productInfo,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      handleError(error, function () {
        handleSubmit(e);
      });
    }
  };

  return (
    <main>
      <label htmlFor="title">
        Título
        <input
          onChange={handleInputChange}
          value={productInfo.title}
          name="title"
          type="text"
        />
      </label>
      <label htmlFor="description">
        Descrição do produto
        <input
          onChange={handleInputChange}
          value={productInfo.description}
          name="description"
          type="text"
        />
      </label>
      <label htmlFor="brand">
        Marca
        <input
          onChange={handleInputChange}
          value={productInfo.brand}
          name="brand"
          type="text"
        />
      </label>
      <label htmlFor="model">
        Modelo
        <input
          onChange={handleInputChange}
          value={productInfo.model}
          name="model"
          type="text"
        />
      </label>
      <label htmlFor="features">
        Características
        {array.map((item, i) => {
          return (
            <input
              name="features"
              onChange={handleInputChange}
              value={item.value}
              id={i}
              type={item.type}
              size="40"
              key={i}
            />
          );
        })}
        <button onClick={addFeature}>+</button>
      </label>
      <label htmlFor="tags">
        Etiquetas (para encontrarem seu produto)
        {tags.map((item) => {
          return (
            <div>
              {item}
              <button onClick={() => handleClick(item)}>X</button>
            </div>
          );
        })}
        <input
          onKeyDown={handleTags}
          onChange={handleInputChange}
          value={productInfo.tags}
          name="tags"
          placeholder="Ex: Eletrônicos, jogos, computador, videogame..."
          type="text"
        />
      </label>
      <label htmlFor="files">
        Imagens
        <input
          onChange={handleInputChange}
          name="files"
          type="file"
          multiple="multiple"
        />
      </label>
      <button onClick={handleSubmit}>submit</button>
    </main>
  );
};

export default NewProduct;
