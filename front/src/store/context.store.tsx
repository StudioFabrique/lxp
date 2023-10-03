import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";

import { themes } from "../config/themes";
import { BASE_URL } from "../config/urls";
import useHttp from "../hooks/use-http";
import User from "../utils/interfaces/user";
import Role from "../utils/interfaces/role";

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
  user: User | null;
  roles: Array<Role>;
  fetchRoles: (role: Role) => void;
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
  user: null,
  roles: Array<Role>(),
  fetchRoles: () => {},
});

const ContextProvider: FC<Props> = (props) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { axiosInstance, sendRequest } = useHttp();
  const [roles, setRoles] = useState<Array<Role>>([]);

  useEffect(() => {
    document
      .querySelector("html")!
      .setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark
      );
  }, [theme]);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setIsLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUser(response.data);
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
      const response = await axiosInstance.get(`${BASE_URL}/auth/handshake`, {
        withCredentials: true,
      });
      setUser(response.data);
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
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const initTheme = () => {
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

  const fetchRoles = useCallback(
    (role: Role) => {
      const applyData = (data: Array<Role>) => {
        const newRole = {
          _id: "0",
          role: "everything",
          label: "Tou",
          rank: role.rank,
        };
        let updatedRoles = Array<Role>();
        updatedRoles = [...updatedRoles, newRole];
        data.forEach((item) => updatedRoles.push(item));
        setRoles(updatedRoles);
      };
      sendRequest(
        {
          path: "/auth/roles",
        },
        applyData
      );
    },
    [sendRequest]
  );

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
    user,
    roles,
    fetchRoles,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
