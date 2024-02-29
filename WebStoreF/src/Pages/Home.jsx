import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";
import CartSideMenu from "../components/Cart/CartSideMenu";
import ProductsCarousel from "../components/ProductsCarousel";
import { useFetchApi } from "../hooks/useFetchApi";
import { Carousel } from "react-responsive-carousel";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const Home = ({ user, address, loading, refreshUser }) => {
  const [toggleCard, setToggleCard] = useState(false);
  const [toggleCart, setToggleCart] = useState(false);
  const [productsIds, setProductsIds] = useState(null);
  const [counter, setCounter] = useState(0);
  const [categories, setCategories] = useState([]);
  const [lastTime, setLastTime] = useState(0);
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

  const {
    data: images,
    loading: fetchingImages,
    error: errorImages,
  } = useFetchApi("/store/get-carousel-images", "POST", data);

  const handleHomeScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      var now = new Date().getTime(); // Time in milliseconds
      if (now - lastTime < 1000) {
        return;
      } else {
        setLastTime(now);
      }
      if (data.interest[counter]) {
        console.log("Teste")
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
  }, [handleHomeScroll]);

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
    toggleCart,
    setToggleCart,
    refreshUser,
  };

  useEffect(() => {
    if (toggleCard) {
      document.body.style.overflow = "hidden";
    }
    if (!toggleCard) {
      document.body.style.overflow = "auto";
    }
  }, [toggleCard]);

  return (
    <>
      {toggleCard && (
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
              <div className="max-w-[1440px] h-[400px] overflow-hidden">
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
                      showIndicators={false}
                      showThumbs={false}
                      showArrows={false}
                    >
                      {images.map((item, i) => {
                        return <img className="" key={item} src={item} />;
                      })}
                    </Carousel>
                  )
                )}
              </div>
              <ProductsCarousel topSelling />
              {categories && (
                <>
                  {categories.map((item) => (
                    <ProductsCarousel key={item} category={item} {...item} />
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
