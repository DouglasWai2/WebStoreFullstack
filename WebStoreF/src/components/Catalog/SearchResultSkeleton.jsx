import React, { useEffect } from "react";
import { Rating } from "react-simple-star-rating";

const SearchResultSkeleton = () => {
  return (
    <>
      {Array.from(
        {
          length: 30,
        },
        (_, i) => i + 1
      ).map((item) => {
        return (
          <div className="w-[250px] bg-white p-3 px-5 shadow-md animate-pulse">
            <div className="aspect-[4/3] object-contain bg-gray-300"></div>
            <div className="mt-3 h-[4.5em]">
              <div className="w-full mt-1 h-[1em] bg-gray-300"></div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Rating size={25} initialValue={0} readonly={true} />
              <div className="text-xs w-3 h-3 bg-gray-300"></div>
            </div>
            <div className="text-sm w-24 h-3 bg-gray-300"></div>
            <div className="flex justify-end">
              <div className="mt-4 w-12 h-10 bg-gray-300"></div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SearchResultSkeleton;
