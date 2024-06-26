import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import MyProductsCard from "../../components/Store/MyProducts/MyProductsCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Filters from "../../components/Store/MyProducts/Filters";
import LoadingSpinner from "../../components/shared/UI/LoadingSpinner";
import { Link } from "react-router-dom";
import ConfirmBox from "../../components/shared/UI/ConfirmBox";

const MyProducts = () => {
  const [filter, setFilter] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [url, setUrl] = useState(
    "/store/my-products?&category=&fromRating=&toRating=&title=&fromDate=&toDate="
  );
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [menu, setMenu] = useState(false);
  const [checked, setChecked] = useState([]);
  const { data, loading, refresh } = useFetchApi(url, "GET");
  const { data: store } = useFetchApi("/store/my-store", "GET");
  const [body, setBody] = useState(null);
  const {
    data: response,
    loading: submiting,
    error: invalid,
  } = useFetchApi(postUrl, "POST", body);

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
    setPostUrl("/store/my-store/delete-products");
  }

  function discountSelected() {
    setBody({ productIDs: checked, discount: discountValue / 100 });
    setPostUrl("/store/my-store/discount-products");
  }

  useEffect(() => {
    if (response === "Discount added") {
      setDiscount(false);
      refresh();
    }
  }, [response, submiting]);

  useEffect(() => {
    if (confirm || discount) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [confirm, discount]);

  return (
    <>
      {discount && (
        <ConfirmBox
          handleClick={discountSelected}
          handleCancel={() => setDiscount(false)}
          setDiscount={setDiscount}
          discount={true}
          loading={submiting}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          text={"Valor do desconto em porcentagem"}
          buttonColor={"bg-green-500"}
          buttonText={"Aplicar"}
        />
      )}
      {confirm && (
        <ConfirmBox
          handleClick={deleteSelected}
          handleCancel={() => setConfirm(false)}
          text={"Tem certeza que deseja excluir este(s) produto(s)?"}
          buttonColor={"bg-red-500"}
          buttonText={"Excluir"}
          loading={submiting}
        />
      )}
      <div className="flex justify-center  py-4 ">
        <div
          className="flex flex-col bg-white shadow rounded-lg 
        items-center max-w-[1440px] py-4 px-2 w-full max-sm:overflow-x-scroll"
        >
          <h1 className="text-2xl">Meus produtos</h1>
          <div className="border-2 w-full border-gray-200 py-4 px-2 rounded-sm relative">
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
                  <span className="max-sm:hidden">Selecionar todos</span>
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
                    <div className="absolute bg-white shadow-md right-0 px-3 py-5 flex flex-col gap-2 animate-appear z-20">
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
                        onClick={() => {
                          if (!checked.length)
                            return alert("Nenhum produto selecionado");
                          setDiscount(true);
                        }}
                        className="text-left rounded-sm bg-[#9dbbae] px-3 py-1 hover:underline"
                      >
                        Aplicar desconto em selecionados
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={
                  "overflow-hidden max-h-0 transition-all !duration-400" +
                  (filter ? " !max-h-[600px]" : "")
                }
              >
                {filter && (
                  <Filters
                    filter={filter}
                    categories={store && store.categories}
                    setUrl={setUrl}
                    url={url}
                    title={title}
                  />
                )}
              </div>
              <div
                aria-label="More filters"
                id="arrow-down"
                onClick={() => {
                  setFilter(!filter);
                }}
                className="w-full text-center bg-gray-300 group cursor-pointer hover:brightness-90 duration-100"
              >
                <FontAwesomeIcon
                  className={"group-hover:animate-bounce"}
                  icon={faChevronDown}
                />
              </div>
            </div>
            {loading && (
              <div className="w-full py-6 flex justify-center">
                <LoadingSpinner />
              </div>
            )}
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
            {!loading && !data && (
              <div className="w-full py-6 flex flex-col items-center">
                <h1 className="text-lg">
                  Você ainda não adicionou nenhum produto
                </h1>
                <Link to="/store/new-product">Adicionar produtos</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProducts;
