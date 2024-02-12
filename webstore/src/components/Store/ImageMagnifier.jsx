import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

const ImageMagnifier = ({ image, setFullscreenImage }) => {
  const displayImage = useRef(null);
  const imagePosition = useRef(null);
  const [larger, setLarger] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const result = useRef(null);
  const lens = useRef(null);

  useEffect(() => {
    if (displayImage.current)
      setLarger(displayImage.current.width > displayImage.current.height);
  }, [image]);

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
        if (isMobile) return;
        lens.current.style.display = "block";
        result.current.style.display = "block";
      }}
      onMouseLeave={() => {
        lens.current.style.display = "none";
        result.current.style.display = "none";
      }}
      onMouseMove={handleMouseHover}
      onTouchEnd={() => {
        // setFullscreenImage(true)
      }}
      ref={imagePosition}
      className={
        "relative flex items-center justify-center z-10 object-contain"
      }
    >
      <img ref={displayImage} className={"max-h-[433px]"} src={image} />
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
          className={`bg-white hidden opacity-60 w-[300px] h-[225px] `}
        ></div>
        <div
          ref={result}
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            display: "none",
          }}
          className={
            "w-[578px] hidden h-[432px] border-[2px] border-white bg-center absolute left-[110%] top-0 bottom-0 my-auto"
          }
        ></div>
      </>
    </div>
  );
};

export default ImageMagnifier;
