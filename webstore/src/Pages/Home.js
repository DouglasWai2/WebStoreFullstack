import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Home = () => {
  const isVerified = window.localStorage.getItem("verified");

  return (
    <>
        <Navbar /> 
    </>
  );
};

export default Home;
