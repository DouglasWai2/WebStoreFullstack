import React from "react";

const SkeletonAddressCard = () => {
  return (
    <div className="border-[1px] flex flex-col gap-8 p-4 w-[250px] shadow-md animate-pulse">
      <div className="w-[50%] bg-gray-300 h-6 rounded-md"></div>
      <div className="w-[85%] bg-gray-300 h-6 rounded-md "></div>
      <div className="w-[50%] bg-gray-300 h-6 rounded-md"></div>
      <div className="w-[85%] bg-gray-300 h-6 rounded-md "></div>
      <div className="w-[50%] bg-gray-300 h-6 rounded-md"></div>
      <div className="w-[85%] bg-gray-300 h-6 rounded-md "></div>
    </div>
  );
};

export default SkeletonAddressCard;
