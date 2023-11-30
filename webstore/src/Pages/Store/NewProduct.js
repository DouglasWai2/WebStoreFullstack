import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetch";

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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBody({
      description,
      title,
      features,
      tags,
      files,
      brand,
      model,
    });
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    if (response) {
      if(response === 'Product saved successfully'){
        navigate('/store/my-store')
      }
    }
  }, [error, response]);

  return (
    <main>
      <label htmlFor="title">
        Título
        <input onChange={handleTitle} value={title} name="title" type="text" />
      </label>
      <label htmlFor="description">
        Descrição do produto
        <input
          onChange={handleDescription}
          value={description}
          name="description"
          type="text"
        />
      </label>
      <label htmlFor="brand">
        Marca
        <input onChange={handleBrand} value={brand} name="brand" type="text" />
      </label>
      <label htmlFor="model">
        Modelo
        <input onChange={handleModel} value={model} name="model" type="text" />
      </label>
      <label htmlFor="features">
        Características
        {array.map((item, i) => {
          return (
            <input
              name="features"
              onChange={handleFeatures}
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
        {tagsArray.map((item) => {
          return (
            <div key={item}>
              {item}
              <button onClick={() => handleClick(item)}>X</button>
            </div>
          );
        })}
        <input
          onKeyDown={handleTagsArray}
          onChange={handleTags}
          value={tags.replace(",", "")}
          name="tags"
          placeholder="Ex: Eletrônicos, jogos, computador, videogame..."
          type="text"
        />
      </label>
      <label htmlFor="files">
        Imagens
        <input
          onChange={handleFiles}
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
