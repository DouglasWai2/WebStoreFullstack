import React, { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";


const CarouselStore = ({ images }) => {

  return (
    <Carousel
      axis="horizontal"
      autoPlay={true}
      infiniteLoop={true}
      showIndicators={false}
      showThumbs={false}
      showArrows={false}
    >
      {images.map((item) => {
        return (
          <div className="w-full h-[40vh] pickgradient">
            <img
              alt="store banner"
              className="object-cover max-w-[1440px] h-full block"
              src={item}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default CarouselStore;
