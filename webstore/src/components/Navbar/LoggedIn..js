import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../helpers/logOut";

const LoggedIn = () => {
  const navigate = useNavigate()

  async function refreshToken(){
    try {
      const response = await axios.get(`http://localhost:5000/auth/refresh`, {withCredentials: true})
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }

  async function getUserInfo() {
    const token = window.localStorage.getItem("accessToken");
    const userid = window.localStorage.getItem("userid");
    try {
      const userInfo = await axios.get(
        `https://localhost:3001/api/${userid}/${token}`
      );
      window.localStorage.setItem("accessToken", userInfo.data.accessToken);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-white text-black absolute bottom-[-110px] left-[-160px] w-[300px] p-6 flex flex-col gap-2 items-center">
      <a
        onClick={() => navigate('/profile')}
        className="text-sm text-blue-600 cursor-pointer hover:underline"
      >
        Meu cadastro
      </a>
      <a onClick={logOut}>
        <p className="text-sm text-blue-600 cursor-pointer hover:underline">
          Sair
        </p>
      </a>
    </div>
  );
};

export default LoggedIn;
