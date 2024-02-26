import { useApi } from "./useApi";
import { useEffect, useState, useCallback } from "react";

// Custom hook for API calls
export const useFetchApi = (path, method, body, config) => {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchApi = useCallback(
    async (body) => {
      if (error) return;
      setLoading(true);
      try {
        const response =
          method === "GET"
            ? path && (await api.get(import.meta.env.VITE_API_URL + path))
            : method === "POST"
            ? await api.post(
                import.meta.env.VITE_API_URL + path,
                body,
                config ? { headers: config } : "" // In case there is headers setted it will be passed in this hook params
              ) //If there's no config setted, default headers will be used
            : null; // If method is GET, body isn't needed
        const data = await response?.data;
        setData(data);
      } catch (e) {
        setError(e.response);
      } finally {
        setLoading(false);
      }
    },
    [method, path, config]
  );

  const refresh = () => {
    setError(null)
    fetchApi(body);
  };
  useEffect(() => {
    if (!path) return;
    if (method === "POST" && !body) return;
    fetchApi(body);
  }, [method, body, path]);

  return { data, loading, error, refresh };
};
