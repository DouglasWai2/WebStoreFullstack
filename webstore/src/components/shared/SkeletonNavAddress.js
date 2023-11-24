import React from "react";

const SkeletonNavAddress = () => {
  return (
    <div className="flex w-[12vw] gap-2 items-center shadow-md animate-pulse">
      <div className="bg-gray-500 h-5 w-5 rounded-md"></div>
      <div className="flex-col flex w-full gap-2 ">
        <div className=" bg-gray-500 h-3 w-2/4 rounded-md"></div>
        <div className=" bg-gray-300 h-2 rounded-md"></div>
        <div className=" bg-gray-300 h-2 w-1/3 rounded-md"></div>
      </div>
    </div>
  );
};

export default SkeletonNavAddress;
