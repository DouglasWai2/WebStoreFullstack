import React, { Component } from "react";

const TextEditor = (onChange, value) => {
  return (
    <textarea
    value={value}
    onChange={onChange}
    id="storeDescription"
    name="storeDescription"
    onKeyDown={(e)=> {
      e.preventDefault()
      if(e.key === 'Enter') {
        console.log(e.key)
      }
    }}
    placeholder=""
    className="w-full border-[1px] border-gray-300 p-2 peer placeholder-shown:focus:brightness-[0.9] transition-[filter] duration-200"
    ></textarea>
  );
};

export default TextEditor;
