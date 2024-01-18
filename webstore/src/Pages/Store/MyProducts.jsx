import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../helpers/useFetchApi";
import { useOutletContext } from "react-router-dom";
import MyProductsCard from "../../components/Store/MyProductsCard";

const MyProducts = () => {
  const { user } = useOutletContext();
  const { data, loading, error, refresh } = useFetchApi(
    "/api/store/my-products",
    "GET"
  );
  const [body, setBody] = useState(null);
  const {
    data: response,
    loading: submiting,
    error: invalid,
  } = useFetchApi("/api/store/my-store/delete-products", "POST", body);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (response === 'Products deleted successfully') {
        console.log(response)
      refresh()
    }
  }, [response]);

  function checkUncheckAll() {
    if (!checked.length) setChecked(data.map((item) => item._id));
    else setChecked([]);
    console.log(checked);
  }

  function checkOne(value) {
    if (!checked.includes(value)) setChecked([...checked, value]);
    else setChecked(checked.filter((item) => item !== value));
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-2xl">Meus produtos</h1>
      <div className="border-2 border-gray-200 py-4 px-2 rounded-sm">
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
            />
            Selecionar todos
          </label>
          <button
            className="bg-yellow-400 px-3 py-1 hover:bg-yellow-500"
            onClick={() => {
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
