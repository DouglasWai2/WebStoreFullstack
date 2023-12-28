import React, { useState } from "react";
import EditButton from "../EditButton";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";
import { CPFMask } from "../../../helpers/CPFMask";

const TableData = ({ item, editForm, handleChange, index }) => {
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
          value={Object.keys(item)[0] === "Celular"
            ? formatPhoneNumber(Object.values(item)[0])
            : Object.keys(item)[0] === "CPF" ? CPFMask(Object.values(item)[0]) :

              !Object.values(item)[0]

          }
          type={
            Object.keys(item)[0] === "Data de Nascimento"
              ? "date"
              : Object.keys(item)[0] === "Email"
                ? "email"
                : "text"
          }
        />
      ) : (
        <>
          <span className="ml-5">
            {Object.keys(item)[0] === "Celular"
              ? formatPhoneNumber(Object.values(item)[0])
              : Object.keys(item)[0] === "CPF" ? CPFMask(Object.values(item)[0]) :

                !Object.values(item)[0]
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
