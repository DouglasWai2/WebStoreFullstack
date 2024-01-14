import Navbar from "../components/Navbar";
import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

const Home = ({user, address, loading, fetching, loggedIn}) => {
  const [toggleCard, setToggleCard] = useState(false);

  TopBarProgress.config({
    barColors: {
      0: "#9dbbae",
      "1.0": "#9dbbae",
    },
    barThickness: 2,
    shadowBlur: 5,
  });

  return (
    <>
      {(loading || fetching) && <TopBarProgress />}
      <Navbar
        toggleCard={toggleCard}
        setToggleCard={setToggleCard}
        data={user}
        address={address}
        loggedIn={loggedIn}
      />
      <main className={"w-full h-full" + (toggleCard ? " brightness-50" : "")}>
        <Outlet context={{ user, address, fetching, loading }} />
      </main>
    </>
  );
};

export default Home;
