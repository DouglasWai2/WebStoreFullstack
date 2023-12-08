import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useFetchApi } from "../helpers/useFetchApi";
import { useState } from "react";
import { useNavigation } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";

const Home = () => {
  const isVerified = window.localStorage.getItem("verified");
  const navigation = useNavigation();
  const [toggleCard, setToggleCard] = useState(false);
  const { data, loading, error } = useFetchApi("/api/user", "GET");
  const { data: address, loading: fetching } = useFetchApi(
    "/api/address",
    "GET"
  );

  TopBarProgress.config({
    barColors: {
      0: "#9dbbae",
      "1.0": "#9dbbae",
    },
    barThickness: 2,
    shadowBlur: 5,
  });

  console.log({ loading });

  return (
    <>
      {(loading || fetching) && <TopBarProgress />}
      <Navbar
        toggleCard={toggleCard}
        setToggleCard={setToggleCard}
        data={data}
        address={address}
      />
      <main className={"w-full h-full" + (toggleCard ? " brightness-50" : "")}>
        <Outlet context={{ data, address, fetching, loading }} />
      </main>
    </>
  );
};

export default Home;
