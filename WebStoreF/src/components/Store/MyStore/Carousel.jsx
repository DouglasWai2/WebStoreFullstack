import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useFetchApi } from "../../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

const CarouselStore = ({ images, edit, method, loading, placeholders, refresh }) => {
  const [bannerEdit, setBannerEdit] = useState(null);
  const [bannerImages, setBannerImages] = useState();
  const headers = { "content-type": "multipart/form-data" };

  const { data, error } = useFetchApi(
    "/store/change-banner",
    method,
    bannerEdit,
    headers
  );

  function handleChange(e) {
    setBannerEdit(e.target.files);
    const array = Array.from(e.target.files).map((item) =>
      URL.createObjectURL(item)
    );
    setBannerImages(array);
    console.log(bannerImages);
  }

  useEffect(() => {
    setBannerImages(images);
  }, [images]);

  useEffect(()=>{
    if(data) refresh()
    if(error) console.log(error)
  }, [data, error])

  return (
    <>
      {edit ? (
        <label
          className="cursor-pointer hover:brightness-75 relative group"
          htmlFor="store-banner"
        >
          <input
            className="absolute w-full h-full opacity-0"
            onChange={handleChange}
            type="file"
            id="store-banner"
            name="files"
            multiple
          />
          <div className="w-screen h-[40vh]">
            <Carousel
              axis="horizontal"
              autoPlay={true}
              infiniteLoop={true}
              showIndicators={false}
              showThumbs={false}
              showArrows={false}
            >
              {bannerImages &&
                bannerImages.map((item, i) => {
                  return (
                    <div
                      key={item + i}
                      className="w-full h-[40vh] pickgradient"
                    >
                      <img
                        alt="store banner"
                        className="object-cover max-w-[1440px] h-full block"
                        src={item}
                      />
                    </div>
                  );
                })}
            </Carousel>
          </div>
          <p className="absolute bottom-[10%] right-[50%] pointer-events-none text-gray-500 opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
            <FontAwesomeIcon icon={faCloudArrowUp} /> Você pode clicar para
            fazer upload do banner ou arrastar o arquivo até esta área
          </p>
        </label>
      ) : (
        <div className="w-screen h-[40vh] overflow-hidden ">
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <Carousel
              axis="horizontal"
              autoPlay={true}
              infiniteLoop={true}
              showIndicators={false}
              showThumbs={false}
              showArrows={false}
            >
              {images
                ? images.map((item, i) => {
                    return (
                      <div
                        key={item + i}
                        className="w-full h-[40vh] pickgradient"
                      >
                        <img
                          alt="store banner"
                          className="object-cover max-w-[1440px] h-full block"
                          src={item}
                        />
                      </div>
                    );
                  })
                : placeholders.map((item, i) => {
                    return (
                      <div
                        key={item + i}
                        className="w-full h-[40vh] pickgradient"
                      >
                        <img
                          alt="store banner"
                          className="object-cover max-w-[1440px] h-full block"
                          src={item}
                        />
                      </div>
                    );
                  })
                  }
            </Carousel>
          )}
        </div>
      )}
    </>
  );
};

export default CarouselStore;
