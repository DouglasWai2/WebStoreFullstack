import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useApi } from "../../hooks/useApi";

const LikeButton = ({ storeId }) => {
  const api = useApi();
  function saveStore(e) {
    e.preventDefault();
    api
      .post(
        import.meta.env.VITE_API_URL + "/user/like_store",
        { storeId },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex items-center text-gray-400 ">
      <label
        htmlFor="likes"
        className="rounded-full w-[30px] h-[30px] cursor-pointer  
  grid justify-center items-center bg-white hover:brightness-90 duration-150 has-[:checked]:!text-red-600"
        onClick={saveStore}
      >
        <input
          name="likes"
          id="likes"
          hidden
          type="checkbox"
          checked={true}
          onChange={(e) => {}}
        />
        <FontAwesomeIcon icon={faHeart} className="pointer-events-none" />
      </label>
      <span>{}</span>
    </div>
  );
};

export default LikeButton;
