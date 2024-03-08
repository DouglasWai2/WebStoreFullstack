import React, { useEffect, useState } from "react";
import EditButton from "../EditButton";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";
import { CPFMask } from "../../../helpers/CPFMask";

const TableData = ({ item, editForm, handleChange, index }) => {
  const [edit, setEdit] = useState();

  const handleClick = () => {
    setEdit(true);
  };

  useEffect(()=>{
    if(!editForm) setEdit(false)
  },[editForm])

  return (
    <>
      {edit ? (
        <input
          name={Object.keys(item)[0]}
          maxLength={item.maxLength || 200}
          onChange={(e) => handleChange(e, index)}
          value={Object.values(item)[0]}
          type={item.type}
          className="border-[1px] rounded-sm border-gray-400 focus:bg-gray-200 transition-colors duration-200 p-1 ml-5 max-sm:ml-0"
        />
      ) : (
        <>
          <span className="ml-5 p-1 max-sm:ml-0">
            {!Object.values(item)[0]
              ? (Object.keys(item)[0] === "Data de Nascimento"
                  ? "Insira uma "
                  : "Insira um ") + Object.keys(item)[0]
              : Object.values(item)[0]}
          </span>

          {editForm ? <EditButton handleClick={handleClick} /> : ""}
        </>
      )}
    </>
  );
};

export default TableData;
