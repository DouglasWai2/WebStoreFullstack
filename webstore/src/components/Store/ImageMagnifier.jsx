import React, { useEffect, useRef, useState } from "react";

const ImageMagnifier = ({ image }) => {
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);
  const resultRef = useRef(null);
  const lens = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // function resizeImage(image){
  //   let canvas = imageContainerRef.current
  //   let ctx = new CanvasRenderingContext2D('2d')
  //   ctx.fillStyle = '#fff';
  //   ctx.fillRect(0,0,759,759);
  //   ctx.drawImage(image, 0, 250);
  // }

  // useEffect(()=> {
  //   resizeImage(image)
  // }, [image])

  const handleMouseHover = (e) => {
    const image = imageRef.current;
    const result = resultRef.current;
    const imageContainer = imageContainerRef.current;
    var x, y;

    //get the ratio between the zoomed in image and the lens
    const cx = result?.offsetWidth / lens.current.offsetWidth;
    const cy = result?.offsetHeight / lens.current.offsetHeight;

    result.style.backgroundSize = `${image?.width * cx}px ${
      image?.height * cy
    }px`;

    // get current mouse position
    x =
      e.pageX -
      imageContainer.getBoundingClientRect().left-
      lens.current.offsetWidth / 2;
    y =
      e.pageY -
      imageContainer.getBoundingClientRect().top -
      lens.current.offsetHeight / 2;

    //stop the lens following the cursor if it's outside of the image
    if (x > imageContainer.getBoundingClientRect().width - lens.current.offsetWidth)
      x = imageContainer.getBoundingClientRect().width - lens.current.offsetWidth;
    // if (x < 0) x = 0;
    if (y > imageContainer.getBoundingClientRect().height - lens.current.offsetHeight)
      y = imageContainer.getBoundingClientRect().height - lens.current.offsetHeight;
    if (y < 0) y = 0;

    setCursorPosition({
      x,
      y,
    });

    console.log( x)
    
    if(x * cx < 0) result.style.backgroundPosition = `-${ x * cx}px -${
      y * cy
    }px`;
    else result.style.backgroundPosition = `-${ x * cx}px -${
      y * cy
    }px`;
  };
  return (
    <div
      onMouseEnter={() => {
        lens.current.style.display = "inline";
        resultRef.current.style.display = "inline";
      }}
      onMouseLeave={() => {
        lens.current.style.display = "none";
        resultRef.current.style.display = "none";
      }}
      onMouseMove={handleMouseHover}
      ref={imageContainerRef}
      className="relative h-full w-full z-10 flex items-center justify-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <img
        ref={imageRef}
        className="object-cover max-w-[578px] max-h-[432px]"
        src={image}
      />

      {
        <>
          <div
            ref={lens}
            style={{
              position: "absolute",
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              pointerEvents: "none",
              display: "none",
            }}
            className="bg-black opacity-60 w-[200px] h-[200px]"
          ></div>
          <div
            ref={resultRef}
            style={{
              backgroundColor: 'white',
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: 'center',
              display: "none",
            }}
            className="w-[500px] h-[500px] border-[2px] border-white bg-center absolute left-[110%] top-0 bottom-0 my-auto"
          ></div>
        </>
      }
    </div>
  );
};

export default ImageMagnifier;
