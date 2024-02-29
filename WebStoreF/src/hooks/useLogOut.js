import axios from "axios";

const useLogOut = () => {
  async function logOut() {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("role");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  }
  return logOut;
};

export { useLogOut };
