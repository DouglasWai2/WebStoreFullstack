import axios from "axios";

export async function logOut() {
    const userId = window.localStorage.getItem("userid");
    try {
        const data = await axios.get(
            `http://localhost:5000/auth/logout/${userId}`, {withCredentials: true}
          );
            window.localStorage.removeItem('accessToken')
            window.localStorage.removeItem('name')
            window.localStorage.setItem('LoggedIn', false)
            window.localStorage.removeItem('verified')
            window.location.href = '/'
    } catch (error) {
        console.log(error)
    }   
  }