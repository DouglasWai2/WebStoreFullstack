import React from "react";
import { Rating } from "react-simple-star-rating";

const Comment = ({ name, comment, rating, title }) => {
  return (
    <div className="border-b-[1px] border-slate-200 py-3 w-full">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{name}</p>
        <p>{title}</p>
        <Rating readonly initialValue={rating} size={30} />
      </div>

      <p className="relative w-full pl-12 before:border-b-2 before:border-l-2 before:absolute before:border-gray-400 before:w-3 before:h-1/2 before:left-8">
        {comment}
      </p>
    </div>
  );
};

export default Comment;
