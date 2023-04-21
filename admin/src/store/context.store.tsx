import axios from "axios";
import React, { FC, useEffect, useState } from "react";

import { themes } from "../config/themes";
import { BASE_URL } from "../config/urls";
import useHttp from "../hooks/use-http";

type ContextType = {
  theme: string;
  initTheme: () => void;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  error: string;
  isLoading: boolean;
  handshake: () => void;
};

type Props = { children: React.ReactNode };

export const Context = React.createContext<ContextType>({
  theme: themes.light,
  initTheme: () => {},
  toggleTheme: () => {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  error: "",
  isLoading: false,
  handshake: () => {},
});

const ContextProvider: FC<Props> = (props) => {
  const [theme, setTheme] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { axiosInstance } = useHttp();

  useEffect(() => {
    document
      .querySelector("html")!
      .setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark
      );
  }, [theme]);

  const login = async (email: string, password: string) => {
    console.log("bonjour login");

    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/user`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      //setUser(response.data);

      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Identifiant ou mot de passe incorrect");
        setIsLoading(false);
        if (err.response?.status === 403) {
          logout();
        }
      } else setError("Problème serveur, réessayez plus tard svp");
    }
  };

  const handshake = async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/auth/handshake` /* {
        withCredentials: true,
      } */
      );
      setIsLoggedIn(true);
      //setUser(response.data);
    } catch (err) {
      logout();
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      //setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const initTheme = () => {
    console.log("coucou theme");

    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");

    if (lightTheme) {
      themes.light = lightTheme;
    }

    if (darkTheme) {
      themes.dark = darkTheme;
    }

    const activeTheme = localStorage.getItem("activeTheme");
    if (activeTheme) {
      setTheme(activeTheme);
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("activeTheme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  };

  const contextValue = {
    theme,
    initTheme,
    toggleTheme,
    isLoggedIn,
    login,
    logout,
    error,
    isLoading,
    handshake,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
