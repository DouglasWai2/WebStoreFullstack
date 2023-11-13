import { refreshToken } from "./getRefreshToken"
import { logOut } from "./logOut"
import axios from "axios";

export async function getUserAddressess() {
  const accessToken = window.localStorage.getItem("accessToken");
    const response = await axios.get(
      `http://localhost:5000/api/address/${accessToken}`,
      { withCredentials: true }
    );
    return response.data;
}
