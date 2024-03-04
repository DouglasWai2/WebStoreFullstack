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
    const imgWrapper = displayImage.current;
    const zoomedImage = result.current;
    const img = imagePosition.current;
    var x, y;

    const cx = zoomedImage?.offsetWidth / lens.current.offsetWidth;
    const cy = zoomedImage?.offsetHeight / lens.current.offsetHeight;
    zoomedImage.style.backgroundSize = `${imgWrapper?.width * cx}px ${
      imgWrapper?.height * cy
    }px`;

    x =
      e.pageX -
      img.getBoundingClientRect().left -
      window.scrollX -
      lens.current.offsetWidth / 2;
    y =
      e.pageY -
      img.getBoundingClientRect().top -
      window.scrollY -
      lens.current.offsetHeight / 2;

    if (x > imgWrapper?.width - lens.current.offsetWidth)
      x = imgWrapper?.width - lens.current.offsetWidth;
    if (x < 0) x = 0;
    if (y > imgWrapper?.height - lens.current.offsetHeight)
      y = imgWrapper?.height - lens.current.offsetHeight;
    if (y < 0) y = 0;

    setCursorPosition({
      x,
      y,
    });

    zoomedImage.style.backgroundPosition = `-${cursorPosition.x * cx}px -${
      cursorPosition.y * cy
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
          className={`bg-white hidden opacity-60 w-[300px] h-[225px] max-md:!hidden`}
        ></div>
        <div
          ref={result}
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            display: "none",
          }}
          className={
            "w-[578px] hidden h-[432px] border-[2px] border-white bg-center absolute left-[110%] top-0 bottom-0 my-auto max-lg:!hidden"
          }
        ></div>
      </>
    </div>
  );
};

export default ImageMagnifier;
