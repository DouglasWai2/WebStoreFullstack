import React, { useRef, useState } from 'react'

const ImageMagnifier = ({image}) => {

    const displayImage = useRef(null)
    const imagePosition = useRef(null)
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
              className="transition-[filter] flex items-center justify-center w-full h-full duration-100 relative"
            >
              {/* <div
              ref={zoomImage}
              id="image-zoom"
              className={
                "absolute h-[150px] w-[150px] bg-white opacity-60 z-99 left-0 top-0 pointer-events-none"
              } */}
              {/* ></div> */}
              <img
                ref={displayImage}
                className="object-fit h-full"
                src={
                    image           
                }
              />

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
                    backgroundPosition: `${position.x}% ${position.y}%`,
                  }}
                  className="w-[200px] h-[200px] border-[2px] border-white bg-center"
                ></div>
              </div>
            </div>
  )
}

export default ImageMagnifier