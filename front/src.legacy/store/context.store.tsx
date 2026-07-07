import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type Role from "../utils/interfaces/role";
import type User from "../utils/interfaces/user";

export type LegacyContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  isAppInitialized: boolean;
  isLoading: boolean;
  error: string;
  roles: Array<Role>;
  socket: Socket | null;
  theme: "light" | "dark";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handshake: () => Promise<void>;
  fetchRoles: (role: Role) => Promise<void>;
  initTheme: () => void;
  toggleTheme: () => void;
  chooseTheme: (newTheme: string, mode: string) => void;
};

export const Context = createContext<LegacyContextValue>({
  user: null,
  isLoggedIn: false,
  isAppInitialized: false,
  isLoading: false,
  error: "",
  roles: [],
  socket: null,
  theme: "light",
  login: async () => {},
  logout: async () => {},
  handshake: async () => {},
  fetchRoles: async () => {},
  initTheme: () => {},
  toggleTheme: () => {},
  chooseTheme: () => {},
});
