import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import MyProductsCard from "../../components/Store/MyProductsCard";
import { formatDate } from "../../helpers/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmDelete from "../../components/Store/ConfirmDelete";
import Menu from "../../components/Store/Menu";
import Filters from "../../components/Store/Filters";

const MyProducts = () => {
  const [filter, setFilter] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(formatDate(new Date()));
  const [fromRating, setFromRating] = useState(0);
  const [toRating, setToRating] = useState(5);
  const [url, setUrl] = useState("/api/store/my-products");
  const [option, setOption] = useState("");
  const [title, setTitle] = useState("");
  const [menu, setMenu] = useState(false);
  const [checked, setChecked] = useState([]);
  const { data, refresh } = useFetchApi(url, "GET");
  const { data: store } = useFetchApi("/api/store/my-store", "GET");
  const [body, setBody] = useState(null);
  const {
    data: response,
    loading: submiting,
    error: invalid,
  } = useFetchApi("/api/store/my-store/delete-products", "POST", body);

  function checkUncheckAll() {
    if (!checked.length) setChecked(data.map((item) => item._id));
    // check if checked array is empty, that is, if anything is checked
    else setChecked([]); // if something is checked, uncheck all
  }

  function checkOne(value) {
    if (!checked.includes(value))
      setChecked([...checked, value]); // add item to checked array
    else setChecked(checked.filter((item) => item !== value)); // remove item from checked array
  }

  function deleteSelected() {
    setBody({ productIDs: checked });
  }

  function discountSelected() {}

  return (
    <>
      {confirm && (
        <ConfirmDelete handleClick={deleteSelected} setConfirm={setConfirm} />
      )}
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl">Meus produtos</h1>
        <div className="border-2 border-gray-200 py-4 px-2 rounded-sm w-[1440px] relative">
          <div className="w-full bg-gray-200">
            <div className="w-full bg-gray-300 flex items-center justify-between px-2 py-4">
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
              <label className="flex flex-col w-[50%]" htmlFor="name-search">
                <div className="w-full flex gap-3">
                  <input
                    value={title}
                    type="text"
                    id="name-search"
                    className="w-full h-[2em]"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setUrl(
                        url.replace(/&title=\D*?(?=&)/, `&title=${title}`)
                      ); // search for title in url and add a value to it
                    }}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </label>
              <div>
                <button
                  className="px-3 py-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenu(!menu);
                  }}
                >
                  <FontAwesomeIcon icon={faCaretDown} />
                </button>
                {menu && (
                  <div className="absolute bg-white shadow-md right-0 px-3 py-5 flex flex-col gap-2 animate-appear">
                    <button
                      onClick={() => {
                        if (!checked.length)
                          return alert("Nenhum produto selecionado");
                        setConfirm(true);
                      }}
                      className="text-left rounded-sm bg-[#9dbbae] px-3 py-1 hover:underline"
                    >
                      Excluir selecionados
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-left rounded-sm bg-[#9dbbae] px-3 py-1 hover:underline"
                    >
                      Aplicar desconto em selecionados
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={"overflow-hidden max-h-0 transition-[max-height]" +  (filter ? ' !max-h-[600px]' : '')}>
            {filter && (
              <Filters filter={filter} categories={store && store.categories} />
            )}
            </div>
            <div
              aria-label="More filters"
              id="arrow-down"
              onClick={() => {
                setFilter(!filter);
              }}
              className="w-full text-center bg-gray-300 group cursor-pointer"
            >
              <FontAwesomeIcon
                className={"group-hover:animate-bounce"}
                icon={faChevronDown}
              />
            </div>
          </div>
          {data &&
            data.map((item, index) => {
              return (
                <MyProductsCard
                  key={index}
                  item={item}
                  checked={checked}
                  handleCheck={checkOne}
                  refresh={refresh}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default MyProducts;
