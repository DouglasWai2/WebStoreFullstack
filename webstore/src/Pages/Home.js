import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useFetchApi } from "../helpers/useFetchApi";

const Home = () => {
  const isVerified = window.localStorage.getItem("verified");
  const { data, loading, error } = useFetchApi("/api/user", "GET");
  const { data: address, loading: fetching} = useFetchApi("/api/address", "GET");

  return (
    <>
        <Navbar data={data} address={address}/>
        <Outlet  context={{data, address, fetching}}/> 
    </>
  );
};

export default Home;
