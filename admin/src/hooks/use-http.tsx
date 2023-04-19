import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../store/context.store";
import { BASE_URL } from "../config/urls";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useContext(Context);

  const axiosInstance = axios.create({ withCredentials: true });

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  const sendRequest = useCallback(
    async (req: any, applyData: (data: any) => void) => {
      setIsLoading(true);
      setError("");
      let response: any;
      try {
        switch (req.method) {
          case "post":
            response = await axios.post(`${BASE_URL}${req.path}`, req.body, {
              headers: req.headers,
              withCredentials: true,
            });
            break;
          case "put":
            response = await axios.put(`${BASE_URL}${req.path}`, req.body, {
              withCredentials: true,
            });
            break;
          case "delete":
            response = await axios.delete(`${BASE_URL}${req.path}`, {
              withCredentials: true,
            });
            break;
          default:
            response = await axios.get(`${BASE_URL}${req.path}`, {
              withCredentials: true,
            });
            break;
        }
        applyData(response.data);
      } catch (err: any) {
        setError(err.response?.data.message);
        if (err.response?.status === 403) {
          logout();
        }
      }
      setIsLoading(false);
    },
    [logout]
  );

  return { isLoading, error, sendRequest };
};

export default useHttp;
