import React, { useEffect, useRef, useState } from "react";
import ImageMagnifier from "./ImageMagnifier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const ProductPreview = ({ files, title, features, description, price }) => {
  const [mainImage, setMainImage] = useState("");
  const [y, setY] = useState(4);
  const images = useRef(null);
  const buttonsWrapper = useRef(null)

  useEffect(() => {
    if (files.length) setMainImage(URL.createObjectURL(files[0]));
  }, [files]);


  function fixButtonsInsideDiv() {
    const rect = images.current.getBoundingClientRect()
    buttonsWrapper.current.style.top = `${rect.top}px`
  }

  useEffect(() => {
    if (buttonsWrapper.current) {

      window.addEventListener('scroll', fixButtonsInsideDiv)

      return () => {
        window.removeEventListener('scroll', fixButtonsInsideDiv)
      }
    }
  }, [files])



  function handleScrollFoward(e) {
    var name = e.target.getAttribute("name");
    if (name === "foward") {
      if (y + 4 > images.current.children.length - 1) {
        images.current?.children[
          images.current.children.length - 2
        ].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      } else {
        setY(y + 4);
        console.log(y)
        images.current.children[y + 4].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }

    if (name === "backward") {
      if (y - 4 < 0) {
        images.current?.firstElementChild.scrollIntoView({
          behavior: "smooth", block: "nearest", inline: "nearest"
        });
        setY(4);
      } else {
        setY(y - 4);
        images.current.children[y - 4].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }

  return (
    <article className="w-2/3">
      <h1 className="font-bold">Previsualização do produto:</h1>
      <section id="product" className="shadow p-4 flex gap-10">
        <div id="images-container" className="">
          {files.length ? (
            <div className="w-auto h-[432px] aspect-[4/3] flex items-center justify-center">
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
                      className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-white hover:brightness-75 transition-[filter] duration-100"
                    >
                      <img
                        className="!object-contain h-full w-full"
                        src={URL.createObjectURL(item)}
                      />
                    </div>
                  );
                })}
                {files.length > 4 && (
                  <div ref={buttonsWrapper} className="fixed w-[578px]">
                    <div
                      className="absolute flex items-center justify-center text-transparent text-2xl 
                      bg-transparent text-white h-[102px] cursor-pointer w-[50px]
                       hover:bg-gray-300/20  hover:text-white/100 duration-200 z-10"
                      name="backward"
                      onClick={handleScrollFoward}
                    >
                      <FontAwesomeIcon
                        className="rotate-180 pointer-events-none"
                        icon={faAngleRight}
                      />
                    </div>
                    <div
                      name="foward"
                      className="absolute flex items-center justify-center text-transparent text-2xl 
                      bg-transparent text-white h-[102px] cursor-pointer w-[50px] right-0
                       hover:bg-gray-300/20  hover:text-white/100 duration-200"
                      onClick={handleScrollFoward}
                    >
                      <FontAwesomeIcon
                        className="pointer-events-none"
                        icon={faAngleRight}
                      />
                    </div>
                  </div>

                )}
              </>
            ) : (
              <>
                {" "}
                <div className="w-[136px] aspect-[4/3] flex items-center justify-center text-gray-400 overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  1
                </div>
                <div className="w-[136px] aspect-[4/3] flex items-center justify-center text-gray-400 overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  2
                </div>
                <div className="w-[136px] aspect-[4/3] flex items-center justify-center text-gray-400 overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  3
                </div>
                <div className="w-[136px] aspect-[4/3] flex items-center justify-center text-gray-400 overflow-hidden bg-gray-200 hover:brightness-75 transition-[filter] duration-100">
                  4
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-3">
          <h1 className="text-3xl">{title ? title : "Título"}</h1>
          <h1 className="text-xl">{price}</h1>
          <h3 className="text-xl">Características</h3>
          <ul className="list-disc ml-7">
            {!!features.length &&
              features.map((item) => {
                return <li key={item.id} className="text-sm mt-2">{item}</li>;
              })
            }
          </ul>
        </div>
      </section>
      <section className="w-[1000px]" id="Product-description">
        <h1 className="text-2xl">Descrição</h1>
        <p className="whitespace-pre-line">{description}</p>
      </section>
    </article>
  );
};

export default ProductPreview;
