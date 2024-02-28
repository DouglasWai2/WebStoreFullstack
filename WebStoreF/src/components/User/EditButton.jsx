import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EditButton = ({value, handleClick}) => {

  return (
    <button onClick={handleClick} className="bg-yellow-300 !w-fit h-fit px-3 hover:bg-yellow-400 rounded-sm">
      <FontAwesomeIcon className="mr-2" icon={faPen} size="2xs" />
      Editar
    </button>
  );
};

export default EditButton;
