import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../../hooks/useFetchApi";
import LoadingSpinner from "../../shared/LoadingSpinner";

const Logo = ({ edit, image, setImageEdit, imageEdit }) => {



  return (
    <>
      {!edit ? (
        !image ? (
          <div className="w-full h-full flex justify-center items-center bg-black opacity-60">
            <LoadingSpinner />
          </div>
        ) : (
          <img
            alt="store logo"
            className="h-full w-full object-cover hover:brightness-75 bg-white"
            src={image}
          />
        )
      ) : (
        <label
          className="relative h-full w-full group hover:brightness-75"
          htmlFor="store-img"
        >
          <input
            onChange={(e) => {
              if (e.target.files[0]) setImageEdit({ file: e.target.files[0] });
            }}
            name="file"
            type="file"
            id="store-img"
            hidden
          />

          <p
            className="absolute text-xs w-full top-[50%] 
          left-[10%] pointer-events-none text-gray-400 opacity-0 
          transition-all duration-300 group-hover:opacity-100 z-10"
          >
            <FontAwesomeIcon icon={faCloudArrowUp} /> Clique para editar
          </p>

          <img
            alt="store logo"
            className="h-full w-full object-cover bg-white cursor-pointer"
            src={!imageEdit ? image : URL.createObjectURL(imageEdit.file)}
          />
        </label>
      )}
    </>
  );
};

export default Logo;
