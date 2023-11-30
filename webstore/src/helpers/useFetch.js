import api from "./api";
import { useEffect, useState, useCallback } from "react";

export const useFetchApi = (path, method, body = null, start = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = useCallback(
    async (body) => {
      try {
        const response =
          method === "GET"
            ? await api.get("http://localhost:5000" + path)
            : body && (await api.post("http://localhost:5000" + path, body));

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
    [error, path]
  );

  useEffect(() => {
    console.log(data)
    fetchApi(body);
  }, [method, body]);

  const refresh = () => {
    fetchApi();
  };
  return { data, loading, error, refresh };
};
