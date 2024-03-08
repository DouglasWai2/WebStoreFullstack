import React, { useEffect, useRef, useState } from "react";
import ImageMagnifier from "./ImageMagnifier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Rating } from "react-simple-star-rating";

const ProductPreview = ({
  files,
  title,
  features,
  description,
  price,
  handleDrop,
  setDragging,
  dragging,
}) => {
  const [mainImage, setMainImage] = useState("");
  const images = useRef(null);

  useEffect(() => {
    if (files.length) setMainImage(URL.createObjectURL(files[0]));
  }, [files]);

  function handleScroll(value) {
    if (images.current) {
      images.current.scrollLeft += value;
    }
  }

  return (
    <article className="w-2/3 max-2xl:w-full max-2xl:max-w-[1440px]">
      <h1 className="font-bold px-2">Previsualização do produto:</h1>
      <section id="product" className="shadow p-4 flex gap-10 max-lg:flex-col">
        <div id="images-container" className="">
          <div className="w-[578px] !h-[433px] flex items-center justify-center object-contain max-md:w-full">
            {files.length ? (
              <ImageMagnifier image={mainImage} />
            ) : (
              <div
                className="bg-gray-200 w-full flex items-center justify-center 
              h-full hover:brightness-75 transition-[filter] duration-100"
              >
                <p>1</p>
              </div>
            )}
          </div>
          <div className="relative">
            {files.length > 4 && !dragging && (
              <div
                className="absolute flex items-center justify-center text-transparent text-2xl 
                                      bg-transparent text-white h-[102px] cursor-pointer w-[50px]
                                    hover:bg-gray-300/20  hover:text-white/100 duration-200"
                name="backward"
                onClick={() => {
                  handleScroll(-578);
                }}
              >
                <FontAwesomeIcon
                  className="rotate-180 pointer-events-none"
                  icon={faAngleRight}
                />
              </div>
            )}
            <DragDropContext
              onDragEnd={handleDrop}
              onDragStart={() => {
                setDragging(true);
              }}
            >
              <Droppable direction={"horizontal"} droppableId={"files"}>
                {(provided) => (
                  <div
                    ref={(e) => {
                      images.current = e;
                      provided.innerRef(e);
                    }}
                    className={
                      "flex w-[578px] overflow-x-scroll my-4 product-images relative max-md:w-full " +
                      (!dragging && "scroll-smooth")
                    }
                  >
                    {files.length ? (
                      <>
                        {files.map((item, index) => {
                          return (
                            <Draggable
                              key={item.name}
                              draggableId={item.name}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onMouseEnter={() => {
                                    setMainImage(URL.createObjectURL(item));
                                  }}
                                  className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-white hover:brightness-75 mx-"
                                >
                                  <img
                                    className="!object-contain h-full w-full pointer-events-none"
                                    src={URL.createObjectURL(item)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {" "}
                        <div className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 mx-1 hover:brightness-75">
                          1
                        </div>
                        <div className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 mx-1 hover:brightness-75">
                          2
                        </div>
                        <div className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 mx-1 hover:brightness-75">
                          3
                        </div>
                        <div className="min-w-[136px] max-w-[136px] aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 mx-1 hover:brightness-75">
                          4
                        </div>
                      </>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {files.length > 4 && !dragging && (
              <div
                name="foward"
                className="absolute flex items-center justify-center text-transparent text-2xl 
                      bg-transparent text-white h-[102px] cursor-pointer w-[50px] right-0 bottom-0
                       hover:bg-gray-300/20  hover:text-white/100 duration-200"
                onClick={() => {
                  handleScroll(578);
                }}
              >
                <FontAwesomeIcon
                  className="pointer-events-none"
                  icon={faAngleRight}
                />
              </div>
            )}
          </div>
          <div className="text-xs text-right w-full text-gray-400">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
            Você pode arrastar as imagens para reordernar. A primeira será a
            foto de capa do produto.
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl">{title ? title : "Título"}</h1>
          <Rating readonly initialValue={0} />
          <h1 className="text-xl">{price}</h1>
          <h3 className="text-xl">Características</h3>
          <ul className="list-disc ml-7">
            {!!features.length &&
              features.map((item, index) => {
                return (
                  <li key={item + index} className="text-sm mt-2">
                    {item}
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
      <section className="w-full px-2" id="Product-description">
        <h1 className="text-2xl">Descrição</h1>
        <p className="whitespace-pre-line">{description}</p>
      </section>
    </article>
  );
};

export default ProductPreview;
