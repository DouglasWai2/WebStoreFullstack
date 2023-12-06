import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useFetchApi } from "../helpers/useFetchApi";
import { useState } from "react";

const Home = () => {
  const isVerified = window.localStorage.getItem("verified");
  const [toggleCard, setToggleCard] = useState(false);
  const { data, loading, error } = useFetchApi("/api/user", "GET");
  const { data: address, loading: fetching } = useFetchApi(
    "/api/address",
    "GET"
  );

  return (
    <>
      <Navbar
        toggleCard={toggleCard}
        setToggleCard={setToggleCard}
        data={data}
        address={address}
      />
      <div className={"w-full" + (toggleCard ? " brightness-50" : "")}>
        <Outlet context={{ data, address, fetching }} />
      </div>
    </>
  );
};

export default Home;
