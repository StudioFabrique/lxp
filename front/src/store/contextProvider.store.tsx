/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

import { themes } from "../config/themes";
import { BASE_API_URL, SOCKET_URL } from "../config/urls";
import useHttp from "../hooks/use-http";
import User from "../utils/interfaces/user";
import Role from "../utils/interfaces/role";
import { Socket, io } from "socket.io-client";
import { Context } from "./context.store";

const ContextProvider = (props: PropsWithChildren) => {
  const { axiosInstance, sendRequest } = useHttp();

  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const login = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_API_URL}/auth/login/`,
        {
          email,
          password,
        },
        { withCredentials: true },
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
      const response = await axiosInstance.get(
        `${BASE_API_URL}/auth/handshake`,
        {
          withCredentials: true,
        },
      );
      setUser(response.data);
    } catch (err) {
      logout();
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.get(`${BASE_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUser(null);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const initTheme = () => {
    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");

    if (lightTheme) {
      themes.light = lightTheme;
    } else {
      localStorage.setItem("lightTheme", "edu-light");
    }

    if (darkTheme) {
      themes.dark = darkTheme;
    } else {
      localStorage.setItem("darkTheme", "night");
    }

    const activeTheme = localStorage.getItem("activeTheme");
    if (activeTheme) {
      setTheme(activeTheme as "light" | "dark");
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  };

  const chooseTheme = useCallback(
    (newTheme: string, mode: string) => {
      if (mode === "light") {
        themes.light = newTheme;
        localStorage.setItem("lightTheme", newTheme);
        setTheme("light");
      } else {
        themes.dark = newTheme;
        localStorage.setItem("darkTheme", newTheme);
        setTheme("dark");
      }
      if (theme === "light") {
        document
          .querySelector("html")!
          .setAttribute("data-theme", themes.light);
      } else if (theme === "dark") {
        document.querySelector("html")!.setAttribute("data-theme", themes.dark);
      }
    },
    [theme],
  );

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
          label: "Tous les rôles",
          rank: role.rank,
          protection: 0,
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
        applyData,
      );
    },
    [sendRequest],
  );

  useEffect(() => {
    document
      .querySelector("html")!
      .setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark,
      );
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchRoles(user.roles[0]);
      setIsLoggedIn(true);
      setIsLoading(false);
      if (!socket) {
        setSocket(
          io(SOCKET_URL, {
            query: {
              userId: user._id,
            },
            withCredentials: true,
          }),
        );
      }
    }
  }, [user, fetchRoles, socket]);

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
    socket,
    chooseTheme,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
