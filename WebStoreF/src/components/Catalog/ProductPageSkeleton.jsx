import React from "react";
import { Rating } from "react-simple-star-rating";
import ShareButton from "../shared/ShareButton";
import LikeButton from "../shared/LikeButton";
import { faHeart, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductPageSkeleton = () => {
  return (
    <div className="w-screen py-10 flex flex-col items-center gap-5 max-lg:px-6 animate-pulse">
      <article className="shadow-md p-6 w-full max-w-[1440px]">
        <div className="flex justify-between py-5 max-lg:flex-col max-lg:justify-normal">
          <section
            id="product-images-section"
            className="max-lg:flex max-lg:flex-col max-lg:items-center"
          >
            <div className="!w-[578px] h-[433px] flex items-center justify-center object-contain">
              <div className="bg-gray-300 w-[578px] h-[433px]"></div>
            </div>
            <div className="flex w-[578px] overflow-x-scroll my-4 product-images relative max-lg:w-full">
              <div className="w-[136px] max-w-[136px] aspect-[4/3] bg-gray-300 mx-1"></div>
              <div className="w-[136px] max-w-[136px] aspect-[4/3] bg-gray-300 mx-1"></div>
              <div className="w-[136px] max-w-[136px] aspect-[4/3] bg-gray-300 mx-1"></div>
              <div className="w-[136px] max-w-[136px] aspect-[4/3] bg-gray-300 mx-1"></div>
              <div className="w-[136px] max-w-[136px] aspect-[4/3] bg-gray-300 mx-1"></div>
            </div>
          </section>
          <section className="max-w-[50%] max-lg:max-w-full w-full flex flex-col gap-3">
            <div className="w-full bg-gray-300 h-7"></div>
            <div className="w-full bg-gray-300 h-7"></div>
            <div className="w-1/2 bg-gray-300 h-7"></div>
            <div className="flex justify-between items-center">
              <div className="bg-gray-300 w-[40%] h-5"></div>
              <div className="bg-gray-300 w-[40%] h-5"></div>
            </div>
            <div className="flex gap-2 items-center">
              <Rating readonly initialValue={0} />
              <span></span>
            </div>
            <div className="flex flex-col gap-10 justify-between h-full max-lg:flex-col-reverse">
              <ul className="list-disc ml-7">
                <div className="bg-gray-300 w-1/3 h-7"></div>
                <div className="bg-gray-300 w-full h-4 mt-3"></div>
                <div className="bg-gray-300 w-2/3 h-4 mt-3"></div>
                <div className="bg-gray-300 w-full h-4 mt-3"></div>
                <div className="bg-gray-300 w-1/3 h-4 mt-3"></div>
              </ul>
            </div>
          </section>
        </div>
        <section>
          <p>Vendido por:</p>
          <div className="flex justify-between items-center gap-8 max-lg:flex-col max-lg:justify-normal">
            <div
              className="flex items-center gap-3 border-2 
            bg-white border-gray-300 rounded-md py-4 px-6 
            duration-300 cursor-pointer w-1/2
            active:translate-y-0 active:shadow-none max-lg:w-full"
            >
              <div className="w-[70px] h-[70px] rounded-full bg-gray-300"></div>
              <div>
                <div className="w-full bg-gray-300 h-5 mb-2"></div>
                <div className="flex gap-4">
                  <FontAwesomeIcon
                    className="text-gray-300"
                    icon={faShareNodes}
                  />
                  <FontAwesomeIcon className="text-gray-300" icon={faHeart} />
                </div>
                <Rating
                  readonly
                  initialValue={0}
                  allowFraction
                  fillColor={"#188fa7"}
                  size={25}
                />
              </div>
            </div>
            <div className="min-w-[200px] w-1/2 max-lg:w-full">
              <button
                className="bg-[#188fa7] w-full px-2 py-2 h-[65px] rounded-md text-xl text-center text-white shadow mb-2"
              >
              </button>
              <button
                className="px-6 bg-[#ade6f1] text-center w-full h-[30px] rounded-md"
              >
              </button>
            </div>
          </div>
        </section>
      </article>
      <section className="w-full max-w-[1440px] mt-10" id="Product-description">
          <div className="text-left">
            <div className="bg-gray-300 w-1/6 h-7"></div>
            <div className="bg-gray-300 w-1/6 h-4 mt-3"></div>
            <div className="bg-gray-300 w-1/4 h-4 mt-3"></div>
            <div className="bg-gray-300 w-full h-4 mt-3"></div>
            <div className="bg-gray-300 w-1/2 h-4 mt-3"></div>
            <div className="bg-gray-300 w-1/3 h-4 mt-3"></div>
          </div>
        </section>
    </div>
  );
};

export default ProductPageSkeleton;
