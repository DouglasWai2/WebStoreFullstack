import { refreshToken } from "./getRefreshToken";
import { logOut } from "./logOut";

export async function handleError(error, cb) {
  if (error?.response.data === "Invalid Token") {
    try {
      await refreshToken();
      cb();
    } catch (error) {
      console.log(error);
      if (
        error?.response.data === "Access Denied. No refresh token provided."
      ) {
        logOut();
      }
    }
  } else if (
    error?.response.data === "Access Denied. No token provided." || 
    error?.response.data === 'Invalid Refresh Token'
  ) {
    logOut();
  }
}
