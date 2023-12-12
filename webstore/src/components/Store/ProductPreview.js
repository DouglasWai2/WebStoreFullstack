import React, { useEffect, useRef, useState } from "react";
import ImageMagnifier from "./ImageMagnifier";

const ProductPreview = ({ files }) => {
  const [mainImage, setMainImage] = useState("");


  return (
    <div className="shadow p-4 flex">
      <div id="images-container" className="">
        {files.length ? (
          <div className="w-auto h-[432px] aspect-[4/3] object-contain">
           <ImageMagnifier image={mainImage}/>
          </div>
        ) : (
          <div className="bg-gray-200 h-[433px] text-gray-400 text-3xl flex justify-center items-center w-[578px] overflow-hidden hover:brightness-75 transition-[filter] duration-100">
            <p>1</p>
          </div>
        )}
        <div className="flex w-[578px] overflow-x-scroll gap-3 my-4 product-images">
          {files.length ? (
            Object.values(files).map((item) => {
              return (
                <div
                  onMouseOver={() => {
                    setMainImage(URL.createObjectURL(item));
                  }}
                  className="min-w-[106px] h-[130px] overflow-hidden bg-white hover:brightness-75 transition-[filter] duration-100"
                >
                  <img
                    className="!object-contain h-full w-full"
                    src={URL.createObjectURL(item)}
                  />
                </div>
              );
            })
          ) : (
            <>
              {" "}
              <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                1
              </div>
              <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                2
              </div>
              <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                3
              </div>
              <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                4
              </div>
              <div className="min-w-[106px] flex items-center justify-center text-gray-400 min-h-[130px] overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                5
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-[578px] flex flex-col gap-3">
        <h1 className="text-3xl">Samsung Galaxy S8</h1>
        <h3 className="text-xl">Características</h3>
        <ul className="list-disc ml-7">
          <li className="text-sm">
            Dispositivo desbloqueado para que você escolha a companhia
            telefônica de sua preferência.
          </li>
          <li className="text-sm">Tela Super AMOLED de 5.8".</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductPreview;
