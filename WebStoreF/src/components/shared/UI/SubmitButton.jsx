import React, { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const SubmitButton = ({ loading, text, onClick, disabled }) => {

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        "button-login flex justify-center items-center " +
        (loading && " brightness-75") + (disabled && " brightness-75 pointer-events-none")
      }
      type="submit"
    >
      {loading ? <LoadingSpinner /> : text}
    </button>
  );
};

export default SubmitButton;
