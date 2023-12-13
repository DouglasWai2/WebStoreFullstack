import React, { useEffect, useRef, useState } from "react";
import ImageMagnifier from "./ImageMagnifier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const ProductPreview = ({ files }) => {
  const [mainImage, setMainImage] = useState("");
  const [y, setY] = useState(4);
  const images = useRef(null);

  useEffect(() => {
    if (files.length) setMainImage(URL.createObjectURL(files[0]));
  }, [files]);

  function handleScrollFoward(e) {
    var name = e.target.getAttribute("name");
    if (name === "foward") {
      if (y + 5 > images.current.children.length - 1) {
        images.current?.children[
          images.current.children.length - 2
        ].scrollIntoView({ behavior: "smooth" });
      } else {
        images.current.children[y + 5].scrollIntoView({ behavior: "smooth" });
        setY(y + 5);
      }
    }

    if (name === "backward") {
      if (y - 5 < 0) {
        images.current?.firstElementChild.scrollIntoView({
          behavior: "smooth",
        });
        setY(4);
      } else {
        setY(y - 5);
        images.current.children[y - 5].scrollIntoView({ behavior: "smooth" });
        setY(y - 5);
      }
    }
  }

  return (
    <div className="shadow p-4 flex">
      <div id="images-container" className="">
        {files.length ? (
          <div className="w-auto h-[432px] aspect-[4/3] object-contain flex items-center justify-center">
            <ImageMagnifier image={mainImage} />
          </div>
        ) : (
          <div className="bg-gray-200 h-[433px] text-gray-400 text-3xl flex justify-center items-center w-[578px] overflow-hidden hover:brightness-75 transition-[filter] duration-100">
            <p>1</p>
          </div>
        )}
        <div
          ref={images}
          className="flex w-[578px] overflow-x-scroll gap-3 my-4 product-images relative"
        >
          {files.length ? (
            <>
              {Object.values(files).map((item, index) => {
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
              })}
              {files.length > 5 && (
                <>
                  <div className="fixed w-[578px] bg-gray-200">
                    <div
                      className="absolute flex items-center justify-center text-transparent text-2xl 
                      bg-transparent text-white h-[130px] cursor-pointer w-[50px]
                       hover:bg-gray-200/20  hover:text-white/100 duration-200"
                      name="backward"
                      onClick={handleScrollFoward}
                    ><FontAwesomeIcon className="rotate-180 pointer-events-none" icon={faAngleRight} /></div>
                    <div
                      name="foward"
                      className="absolute flex items-center justify-center text-transparent text-2xl 
                      bg-transparent text-white h-[130px] cursor-pointer w-[50px] right-0
                       hover:bg-gray-200/20  hover:text-white/100 duration-200"
                      onClick={handleScrollFoward}
                    >
                      <FontAwesomeIcon className="pointer-events-none" icon={faAngleRight} />
                    </div>
                  </div>
                </>
              )}
            </>
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
