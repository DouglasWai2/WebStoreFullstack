import Navbar from "../components/Navbar/index";

const Home = () => {
  const isVerified = window.localStorage.getItem("verified");
  return (
      <headers>
        <Navbar />
        {isVerified === "false" ? (
          <h3 className="text-xl font-bold bg-red-100">
          Enviamos um link de verificação para seu e-mail. Por favor verifique
          sua caixa de entrada.
        </h3>
        ) : (
          ""
        )}
      </headers>
  );
};

export default Home;
