import { refreshToken } from "./getRefreshToken";
import { logOut } from "./logOut";

export async function handleError(error, cb) {
  console.log(error)
  if (error?.response.data === "Expired access token") {
    try {
      await refreshToken();
      cb();
    } catch (error) {
      if (
        error?.response.data === "Access Denied. No refresh token provided."
      ) {
        logOut();
      }
    }
  } else if (
    error?.response.data === "Access Denied. No token provided." || 
    error?.response.data === 'Expired refresh token'
  ) {
    logOut();
  }
}
