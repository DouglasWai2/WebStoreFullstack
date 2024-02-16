import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useFetchApi } from "../../hooks/useFetchApi";

const LikeButton = ({ storeId, user, numLikes }) => {
  const api = useApi();
  const [body, setBody] = useState(null)
  const {data, error, loading} = useFetchApi("/user/like_store", "POST", body)
  function saveStore(e) {
    e.preventDefault();
    setBody({storeId})
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
          checked={data ? data.liked : user?.includes(storeId)}
          onChange={(e) => {}}
        />
        <FontAwesomeIcon icon={faHeart} className="pointer-events-none" />
      </label>
      <span>{data ? data.likes : numLikes}</span>
    </div>
  );
};

export default LikeButton;
