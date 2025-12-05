// front/src/store/context.ts
import React from "react";
import { Socket } from "socket.io-client";
import User from "../utils/interfaces/user";
import Role from "../utils/interfaces/role";

export type ContextType = {
  theme: "light" | "dark";
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
  socket: Socket | null;
  chooseTheme: (newTheme: string, mode: string) => void;
};

export const Context = React.createContext<ContextType>({
  theme: "light",
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
  socket: null,
  chooseTheme: () => {},
});
