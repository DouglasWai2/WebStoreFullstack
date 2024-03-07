import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";
import CartSideMenu from "../components/Cart/CartSideMenu";
import ProductsCarousel from "../components/ProductsCarousel";
import { useFetchApi } from "../hooks/useFetchApi";
import { Carousel } from "react-responsive-carousel";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Logo from "../components/Store/MyStore/Logo";
import { isMobile } from "react-device-detect";

const Home = ({ user, address, loading, refreshUser }) => {
  const [toggleCard, setToggleCard] = useState(false);
  const [toggleSideNav, setToggleSideNav] = useState(false);
  const [toggleCart, setToggleCart] = useState(false);
  const [productsIds, setProductsIds] = useState(null);
  const [counter, setCounter] = useState(0);
  const [categories, setCategories] = useState([]);
  const [lastTime, setLastTime] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    var lvpIDs = JSON.parse(localStorage.getItem("lvpIDs"));
    if (lvpIDs?.length > 0) setProductsIds(lvpIDs);
  }, []);

  const {
    data,
    loading: fetching,
    error,
  } = useFetchApi("/user/interests", "POST", productsIds);

  useEffect(() => {
    if (data) {
      setCategories((categories) => [...categories, data.interest[counter]]);
      setCounter((counter) => counter + 1);
    }
  }, [data]);

  const {
    data: images,
    loading: fetchingImages,
    error: errorImages,
  } = useFetchApi("/store/get-carousel-images", "POST", data);

  const handleHomeScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 50
    ) {
      var now = new Date().getTime(); // Time in milliseconds
      if (now - lastTime < 600) {
        return;
      } else {
        setLastTime(now);
      }
      if (data.interest[counter]) {
        setCategories((categories) => [...categories, data.interest[counter]]);
        setCounter((counter) => counter + 1);
      }
    }
  }, [counter, categories, data, lastTime]);

  useEffect(() => {
    if (location.pathname === "/") {
      window.addEventListener("scroll", handleHomeScroll);
    }
    return () => window.removeEventListener("scroll", handleHomeScroll);
  }, [handleHomeScroll, location]);

  TopBarProgress.config({
    barColors: {
      0: "#9dbbae",
      "1.0": "#9dbbae",
    },
    barThickness: 2,
    shadowBlur: 5,
  });

  const props = {
    user,
    address,
    toggleCard,
    setToggleCard,
    setToggleSideNav,
    toggleSideNav,
    toggleCart,
    setToggleCart,
    refreshUser,
  };

  useEffect(() => {
    if (toggleCard || toggleSideNav) {
      document.body.style.overflow = "hidden";
    }
    if (!toggleCard && !toggleSideNav) {
      document.body.style.overflow = "auto";
    }
  }, [toggleCard, toggleSideNav]);

  return (
    <>
      {(toggleCard || toggleSideNav) && (
        <div className="absolute right-0 top-0 w-screen h-screen bg-black/50 overflow-hidden flex items-center justify-center z-30"></div>
      )}
      {loading && <TopBarProgress />}
      <Navbar {...props} />
      <main className={"w-full h-full"}>
        {toggleCart && <CartSideMenu setCart={setToggleCart} />}
        {location.pathname !== "/" ? (
          <Outlet context={{ ...props }} />
        ) : (
          <>
            <div className="w-full flex flex-col items-center gap-8">
              <div className="max-w-[1440px] h-[40vh] overflow-hidden max-sm:w-full max-sm:h-[30vh]">
                {fetchingImages ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <LoadingSpinner size="w-12 h-12" />
                  </div>
                ) : (
                  images && (
                    <Carousel
                      axis="horizontal"
                      autoPlay={true}
                      infiniteLoop={true}
                      // showIndicators={false}
                      showThumbs={false}
                      showArrows={false}
                    >
                      {images.carouselImages.map((item, i) => {
                        return (
                          <div className="relative flex items-center h-[40vh] overflow-hidden max-sm:w-full max-sm:h-[30vh]">
                            <img
                              alt="banner image from store"
                              className="object-cover max-w-[1440px] h-full block"
                              key={item}
                              src={item}
                            />
                            <div
                              onClick={() => {
                                navigate(
                                  `/store/${images.storeInfo[i].name}/${images.storeInfo[i].id}`
                                );
                              }}
                              className="absolute flex flex-col items-center bottom-5 left-5 hover:opacity-60
                            hover:translate-y-[-10px] duration-300 cursor-pointer 
                            active:translate-y-0"
                            >
                              <p className="text-white">Por:</p>
                              <Logo
                                image={images.storeInfo[i].image}
                                className="shadow-lg items-center justify-center w-[100px] h-[100px] overflow-hidden
                                   rounded-full border-white border-4 max-sm:w-[50px] max-sm:h-[50px] max-sm:border-[1px]"
                              />
                              <p className="text-white">
                                {images.storeInfo[i].name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </Carousel>
                  )
                )}
              </div>
              <ProductsCarousel isMobile={isMobile} topSelling />
              {categories && (
                <>
                  {categories.map((item) => (
                    <ProductsCarousel
                      isMobile={isMobile}
                      key={item}
                      category={item}
                      {...item}
                    />
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Home;
