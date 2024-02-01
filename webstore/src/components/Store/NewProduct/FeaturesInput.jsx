import React from "react";

const FeaturesInput = ({ item, i, deleteFeature, handleChange }) => {
  console.log(item.id)
  return (
    <div className="relative my-2 z-0">
      <button
        onClick={(e) => {
          e.preventDefault();
          deleteFeature(item.id);
        }}
        className="absolute h-full px-2 right-0"
      >
        X
      </button>
      <input
        placeholder=""
        className="floating-input-effect w-full peer"
        name={"features." + i}
        onChange={handleChange}
        value={item.value}
        id={item.id}
        type={item.type}
        size="40"
        required
      />
      <label className="floating-label" htmlFor="features">
        Característica {i + 1}
      </label>
    </div>
  );
};

export default FeaturesInput;
