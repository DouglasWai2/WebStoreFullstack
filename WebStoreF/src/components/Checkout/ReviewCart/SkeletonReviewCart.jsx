const SkeletonReviewCart = () => {
  return (
    <div
      className="shadow-md animate-pulse py-4 px-2 rounded-lg bg-[#fcfcfc] border-b-[1px] border-[#152128] text-sm lg:px-6"

    >
      <div className="w-1/3 bg-gray-300 h-3"></div>
      <div
        className="flex justify-between items-center border-b-[1px] border-gray-300 text-sm py-2 mx-1"
      >
        <div className="flex gap-3 items-center">
          <div className="h-[80px] w-[80px] bg-gray-300 object-contain">
          </div>
        </div>
          <div className="w-full bg-gray-300 h-3 mx-4"></div>
        <div className="mx-2 bg-gray-300 h-3 w-3 mr-2"></div>
        <div className="bg-gray-300 h-3 w-12 justify-self-end"></div>
      </div>
    
      <div className="text-justify font-bold flex justify-between mt-2">
        <p>Subtotal </p>
        <p className="bg-gray-300 h-3 w-20">
         
        </p>
      </div>
      <div className="mt-2 flex justify-between py-4">
        <p className="font-bold">Frete:</p>
        <p className="bg-gray-300 h-3 w-16"></p>
      </div>
      <div>
        <div
          className="rounded-lg border w-1/6 h-7 border-blue-600 px-2 py-1 
         text-blue-600"
        >
        </div>
      </div>
    </div>
  );
};

export default SkeletonReviewCart;
