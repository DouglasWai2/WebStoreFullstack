import React from "react";

const FormInput = ({ value, name, handleChange, label, props }) => {
  return (
    <div className="relative my-2 z-0">
      <input
        placeholder=""
        className={"floating-input-effect w-full peer "}
        onChange={handleChange}
        value={value}
        name={name}
        type="text"
        required
        {...props}
      />
      <label className="floating-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export default FormInput;
