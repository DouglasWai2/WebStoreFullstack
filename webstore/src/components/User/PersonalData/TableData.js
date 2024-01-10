import React, { useState } from "react";
import EditButton from "../EditButton";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";
import { CPFMask } from "../../../helpers/CPFMask";

const TableData = ({ item, editData, editForm, handleChange, index }) => {
  const [edit, setEdit] = useState();

  const handleClick = () => {
    setEdit(true);
  };

  return (
    <>
      {edit ? (
        <input
          name={Object.keys(item)[0]}
          onChange={(e) => handleChange(e, index)}
          value={
            (item.Celular && formatPhoneNumber(editData.Celular)) ||
            (item.CPF && CPFMask(editData.CPF))
          }
          type={item.type}
          className="border-[1px] border-gray-400 focus:bg-gray-200 transition-colors duration-200 p-1 ml-5"
        />
      ) : (
        <>
          <span className="ml-5 p-1">
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
