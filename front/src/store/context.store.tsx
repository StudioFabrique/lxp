/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";

import { themes } from "../config/themes";
import { BASE_URL, SOCKET_URL } from "../config/urls";
import useHttp from "../hooks/use-http";
import User from "../utils/interfaces/user";
import Role from "../utils/interfaces/role";
import { casbinAuthorizer } from "../config/rbac";
import { Socket, io } from "socket.io-client";

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
  defineRulesFor: () => void;
  builtPerms: Record<string, any> | undefined;
  //closeTab: () => void;
  socket: Socket | null;
  chooseTheme: (newTheme: string, mode: string) => void;
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
  defineRulesFor: () => {},
  builtPerms: {},
  //closeTab: () => {},
  socket: null,
  chooseTheme: () => {},
});

const ContextProvider: FC<Props> = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { axiosInstance, sendRequest } = useHttp();
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [builtPerms, setBuiltPerms] = useState<
    Record<string, any> | undefined
  >();
  const [socket, setSocket] = useState<Socket | null>(null);

  /*   const closeTab = useCallback(async () => {
    await axiosInstance.get(`${BASE_URL}/auth/close`, {
      withCredentials: true,
    });
  }, [axiosInstance]); */

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
      await axiosInstance.get(`${BASE_URL}/auth/logout`, {
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
      localStorage.setItem("lightTheme", "winter");
    }

    if (darkTheme) {
      themes.dark = darkTheme;
    } else {
      localStorage.setItem("darkTheme", "night");
    }

    const activeTheme = localStorage.getItem("activeTheme");
    if (activeTheme) {
      setTheme(activeTheme);
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
      } else {
        themes.dark = newTheme;
        localStorage.setItem("darkTheme", newTheme);
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

  const defineRulesFor = useCallback(async () => {
    if (!roles) return;

    // superUser roles definition
    const builtPerms: Record<string, any> = {};

    // perms should be of format
    // { 'read': ['Contact', 'Database']}
    for (const role of roles) {
      const applyData = (data: any) => {
        const permissions: any[] = data.data;

        permissions.forEach((permission) => {
          builtPerms[permission.action] = [
            ...(builtPerms[permission.action] || []),
            ...permission.ressources,
          ];
        });
      };

      await sendRequest(
        { path: `/permission/${role.role}`, method: "get" },
        applyData,
      );
    }

    if (builtPerms) {
      casbinAuthorizer.setPermission(builtPerms);
      if (Object.entries(builtPerms).length > 0) {
        console.log({ autorisationsPourUtilisateurConnecteActuel: builtPerms });
      }
      setBuiltPerms(builtPerms);
    }
  }, [roles, sendRequest]);

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
        applyData,
      );
    },
    [sendRequest],
  );

  useEffect(() => {
    defineRulesFor();
  }, [defineRulesFor, roles]);

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
  }, [user, socket]);

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
    defineRulesFor,
    builtPerms,
    //closeTab,
    socket,
    chooseTheme,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
