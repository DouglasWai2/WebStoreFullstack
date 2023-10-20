import axios from 'axios'

export async function refreshToken(){
    const data = await axios.get(`http://localhost:5000/auth/refresh`, {
        withCredentials: true,
      });
      const accessToken = data.data.accessToken;
      window.localStorage.setItem("accessToken", accessToken);
}