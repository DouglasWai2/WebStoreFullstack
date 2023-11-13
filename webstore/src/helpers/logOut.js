import axios from "axios";

export async function logOut() {

    try {
        const data = await axios.get(
            `http://localhost:5000/auth/logout`, {withCredentials: true}
          );
            window.localStorage.removeItem('accessToken')
            window.localStorage.removeItem('name')
            window.localStorage.removeItem('lastName')
            window.localStorage.setItem('LoggedIn', false)
            window.localStorage.removeItem('verified')
            window.location.href = '/'
    } catch (error) {
        console.log(error)
    }   
  }