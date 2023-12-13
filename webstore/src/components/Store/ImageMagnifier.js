import React, { useRef, useState } from "react";

const ImageMagnifier = ({ image }) => {
  const displayImage = useRef(null);
  const imagePosition = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseHover = (e) => {
    const { left, top, width, height } =
      displayImage.current.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setPosition({ x, y });
    setCursorPosition({
      x: e.pageX - imagePosition.current.getBoundingClientRect().left,
      y: e.pageY - imagePosition.current.getBoundingClientRect().top,
    });
  };
  return (
    <div
      onMouseEnter={() => {
        setShowMagnifier(true);
      }}
      onMouseLeave={() => {
        setShowMagnifier(false);
      }}
      onMouseMove={handleMouseHover}
      ref={imagePosition}
      className="transition-[filter] flex items-center justify-center w-full h-full duration-100 relative z-40"
    >
      <img ref={displayImage} className="object-fit h-full" src={image} />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            left: `${cursorPosition.x - 100}px`,
            top: `${cursorPosition.y - 100}px`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${displayImage.current.width * 2}px auto`,
              backgroundPosition: `${position.x}% ${position.y}%`,
            }}
            className="w-[200px] h-[200px] border-[2px] border-white bg-center"
          ></div>
        </div>
      )}
    </div>
  );
};

export default ImageMagnifier;
