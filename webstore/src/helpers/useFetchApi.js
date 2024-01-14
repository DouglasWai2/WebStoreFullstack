import api from "./api";
import { useEffect, useState, useCallback } from "react";


// Custom hook for API calls
export const useFetchApi = (path, method, body, config) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchApi = useCallback(
    async (body) => {
      setLoading(true);
      try {
        const response =
          method === "GET"
            ? path && (await api.get("http://localhost:5000" + path)) // If method is GET, body isn't needed
            : method === "POST" // If method is POST and body isn't undefined, API can be requested with POST method
            ? path &&
              body && 
              (await api.post(
                "http://localhost:5000" + path,
                body,
                config ? { headers: config } : "" // In case there is headers setted it will be passed in this hook params 
                ))                                //If there's no config setted, default headers will be used        
            : null;
        const data = await response?.data;
        setData(data);
      } catch (e) {
        setError(e.response.data); // Return error
      } finally {
        setLoading(false);
      }
      if (error) { // To avoid infinite api call loop, return if error
        return;
      }
    },
    [error, method, path]
  );

  useEffect(() => {
    if (path) {
      fetchApi(body);
    }
  }, [method, body, path]);

  const refresh = () => {
    fetchApi();
  };
  return { data, loading, error, refresh };
};
