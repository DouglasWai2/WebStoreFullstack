import axios from "axios";

export async function logOut() {
    try {
      const data = await axios.get(`http://localhost:5000/api/v1/auth/logout`, {
        withCredentials: true,
      });
      window.localStorage.removeItem("accessToken");
      document.cookie = 'loggedin=True; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.localStorage.removeItem("role");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  
}
