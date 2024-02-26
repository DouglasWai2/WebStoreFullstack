import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";
import CartSideMenu from "../components/Cart/CartSideMenu";
import ProductsCarousel from "../components/ProductsCarousel";
import { useFetchApi } from "../hooks/useFetchApi";

const Home = ({ user, address, loading, refreshUser }) => {
  const [toggleCard, setToggleCard] = useState(false);
  const [toggleCart, setToggleCart] = useState(false);
  const [productsIds, setProductsIds] = useState(null);
  const location = useLocation()

  useEffect(() => {
    var lvpIDs = JSON.parse(localStorage.getItem("lvpIDs"));
    if (lvpIDs?.length > 0) setProductsIds(lvpIDs);
  }, []);

  const {
    data,
    loading: fetching,
    error,
  } = useFetchApi("/user/interests", "POST", productsIds);

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

  return (
    <>
      {loading && <TopBarProgress />}
      <Navbar {...props} />
      <main className={"w-full h-full " + (toggleCard && "brightness-50")}>
        {toggleCart && <CartSideMenu setCart={setToggleCart} />}
        {location.pathname !== "/" ? (
          <Outlet context={{ ...props }} />
        ) : (
        <div className="w-full flex justify-center">
          <ProductsCarousel category={"Eletrônicos"} />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
