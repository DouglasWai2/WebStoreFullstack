import axios from "axios";
import { useLogOut } from "./useLogOut";

function useApi() {
  const logOut = useLogOut();
  const api = axios.create({
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log(error);
      Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 403) {
        logOut();
      }

      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {
              withCredentials: true,
            }
          );
          const { accessToken } = await response.data;

          window.localStorage.setItem("accessToken", accessToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (error) {
          console.log(error);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
export { useApi };
