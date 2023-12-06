import api from "./api";
import { useEffect, useState, useCallback } from "react";

export const useFetchApi = (path, method, body, config) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = useCallback(
    async (body) => {
      setLoading(true);
      try {
        const response =
          method === "GET"
            ? path && (await api.get("http://localhost:5000" + path))
            : method === "POST"
            ? path &&
              body &&
              (await api.post(
                "http://localhost:5000" + path,
                body,
                config ? { headers: config } : ""
              ))
            : null;
        const data = await response?.data;
        setData(data);
      } catch (e) {
        setError(e.response.data);
      } finally {
        setLoading(false);
      }
      if (error) {
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
