import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";
import CartSideMenu from "../components/Cart/CartSideMenu";

const Home = ({
  user,
  address,
  fetchingAddress,
  loading,
  fetching,
  loggedIn,
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
    fetching,
    toggleCard,
    setToggleCard,
    toggleCart,
    setToggleCart,
  };

  return (
    <>
      {(loading || fetchingAddress) && <TopBarProgress />}
      <Navbar {...props} />
      <main className={"w-screen h-full " + (toggleCard && "brightness-50")}>
        {toggleCart && <CartSideMenu setCart={setToggleCart} />}
        <Outlet context={{ user, address, fetching, loading, refreshUser }} />
      </main>
    </>
  );
};

export default Home;
