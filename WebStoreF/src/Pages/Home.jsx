import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";
import CartSideMenu from "../components/Cart/CartSideMenu";

const Home = ({
  user,
  address,
  loading,
  refreshUser
}) => {
  const [toggleCard, setToggleCard] = useState(false);
  const [toggleCart, setToggleCart] = useState(false);

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
    refreshUser
  };


  function handleScroll(e){
    const bottom = Math.abs(e.scrollHeight - (e.scrollTop + e.clientHeight))
    if(bottom <= 1){
      console.log("Chegou ao fim")
    }
  }

  return (
    <>
      {(loading) && <TopBarProgress />}
      <Navbar {...props} />
      <main className={"w-full h-full " + (toggleCard && "brightness-50")} onScroll={handleScroll}>
        {toggleCart && <CartSideMenu setCart={setToggleCart} />}
        <Outlet context={{...props}} />
      </main>
    </>
  );
};

export default Home;
