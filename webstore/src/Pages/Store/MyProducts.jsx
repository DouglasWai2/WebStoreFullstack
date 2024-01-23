import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import MyProductsCard from "../../components/Store/MyProductsCard";
import { formatDate } from "../../helpers/formatDate";

const MyProducts = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(formatDate(new Date()));
  const [url, setUrl] = useState(
    "/api/store/my-products?&category=&title=&fromDate=&toDate=" + toDate
  );
  const [option, setOption] = useState("");
  const [title, setTitle] = useState("");
  const { data, refresh } = useFetchApi(url, "GET");
  const { data: store } = useFetchApi("/api/store/my-store", "GET");
  const [body, setBody] = useState(null);
  const {
    data: response,
    loading: submiting,
    error: invalid,
  } = useFetchApi("/api/store/my-store/delete-products", "POST", body);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (response === "Products deleted successfully") {
      refresh();
    }
  }, [response]);

  useEffect(() => {
    setUrl(url.replace(/&category=\D*?(?=&)/, `&category=${option}`)); // search for category in url and add a value to it
  }, [option]);

  useEffect(() => {
    console.log(url);
    // if(toDate){
    //   setUrl(url.replace(/&toDate=\D*(?=&*)/, `&toDate=${toDate}`));
    //   console.log(url)
    // }
  }, [url]);

  function handleChange(e) {
    setUrl(url.replace(/&fromDate=\D*?(?=&)/, `&fromDate=${e.target.value}`));
    console.log(url);
  }

  function checkUncheckAll() {
    if (!checked.length)
      setChecked(
        data.map((item) => item._id)
      ); // check if checked array is empty, that is, if anything is checked
    else setChecked([]); // if something is checked, uncheck all
  }

  function checkOne(value) {
    if (!checked.includes(value))
      setChecked([...checked, value]); // add item to checked array
    else setChecked(checked.filter((item) => item !== value)); // remove item from checked array
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-2xl">Meus produtos</h1>
      <div className="border-2 border-gray-200 py-4 px-2 rounded-sm max-w-[1440px]">
        <div className="w-full h-[3em] bg-gray-400 flex items-center justify-between px-2">
          <label
            htmlFor="select-all"
            className="cursor-pointer has-[:checked]:text-blue-500 select-none"
          >
            <input
              className="mr-1"
              id="select-all"
              type="checkbox"
              onClick={checkUncheckAll}
              checked={checked.length}
              onChange={(e) => {}}
            />
            Selecionar todos
          </label>
          <div>
            Filtrar por data
            <label htmlFor="date_from" className="">
              De:
              <input
                className="mr-1"
                id="date_from"
                type="date"
                onChange={handleChange}
              />
            </label>
            <label htmlFor="date_to">
              à:
              <input
                className="mr-1"
                id="date_to"
                type="date"
                onChange={(e) => {
                  setUrl(url.replace(/&toDate=\D*(?=&*)/, `&toDate=${e.target.value}`));
                }}
              />
            </label>
            <button onClick={(e) => {}}>Filtrar</button>
          </div>
          <label htmlFor="name-search">
            Procurar por nome
            <input
              value={title}
              type="text"
              id="name-search"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                setUrl(url.replace(/&title=\D*?(?=&)/, `&title=${title}`)); // search for title in url and add a value to it
              }}
            >
              procurar
            </button>
          </label>
          <label htmlFor="categories">
            Filtrar por categoria
            <select
              className="min-w-[250px]"
              id="categories"
              value={option}
              onChange={(e) => {
                setOption(e.target.value);
              }}
            >
              <option value="">Selecione uma opção</option>
              {store &&
                store.categories.map((item, index) => {
                  return (
                    <option key={item + "-" + index} value={item}>
                      {item}
                    </option>
                  );
                })}
            </select>
          </label>
          <button
            className="bg-yellow-400 px-3 py-1 hover:bg-yellow-500"
            onClick={(e) => {
              e.preventDefault()
              setBody({ productIDs: checked });
            }}
          >
            Excluir selecionados
          </button>
        </div>
        {data &&
          data.map((item, index) => {
            return (
              <MyProductsCard
                key={index}
                item={item}
                checked={checked}
                handleCheck={checkOne}
                setBody={setBody}
              />
            );
          })}
      </div>
    </div>
  );
};

export default MyProducts;
