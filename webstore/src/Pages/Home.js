import { useEffect } from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  const isVerified = window.localStorage.getItem("verified");

  return (
        <Navbar />   
  );
};

export default Home;
