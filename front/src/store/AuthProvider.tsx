import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { SOCKET_URL } from "../config/urls";
import apiClient from "../lib/axios";
import User from "../utils/interfaces/user";
import Role from "../utils/interfaces/role";

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isAppInitialized: boolean;
  isLoading: boolean;
  error: string;
  roles: Array<Role>;
  socket: Socket | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handshake: () => Promise<void>;
  fetchRoles: (role: Role) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isAppInitialized: false,
  isLoading: false,
  error: "",
  roles: [],
  socket: null,
  login: async () => {},
  logout: async () => {},
  handshake: async () => {},
  fetchRoles: async () => {},
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const isLoggedIn = Boolean(user);

  const logout = useCallback(async () => {
    try {
      await apiClient.get("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        "/auth/login/",
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
        if (err.response?.status === 403) logout();
      } else {
        setError("Problème serveur, réessayez plus tard svp");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handshake = useCallback(async () => {
    try {
      const response = await apiClient.get("/auth/handshake");
      setUser(response.data);
    } catch (err) {
      logout();
    }
  }, [logout]);

  const fetchRoles = useCallback(async (role: Role) => {
    try {
      const response = await apiClient.get("/auth/roles");
      const newRole = {
        _id: "0",
        role: "everything",
        label: "Tous les rôles",
        rank: role.rank,
        protection: 0,
      };
      setRoles([newRole, ...response.data]);
    } catch (err) {
      console.error("Erreur lors de la récupération des rôles", err);
    }
  }, []);

  // Déclenche la récupération des rôles quand l'utilisateur est défini
  useEffect(() => {
    if (user && user.roles.length > 0) {
      fetchRoles(user.roles[0]);
      setIsLoading(false);
    }
  }, [user, fetchRoles]);

  useEffect(() => {
    handshake().finally(() => {
      // Que le handshake réussisse ou échoue, l'application a fini de vérifier la session
      setIsAppInitialized(true);
    });
  }, [handshake]);

  // Gère la connexion et déconnexion du Socket
  useEffect(() => {
    let newSocket: Socket | null = null;

    if (user) {
      newSocket = io(SOCKET_URL, {
        query: { userId: user._id },
        withCredentials: true,
      });
      setSocket(newSocket);
    }

    // Cleanup: se déconnecte si le composant est démonté ou si l'utilisateur change (ex: logout)
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <AuthContext
      value={{
        user,
        isLoggedIn,
        isAppInitialized,
        isLoading,
        error,
        roles,
        socket,
        login,
        logout,
        handshake,
        fetchRoles,
      }}
    >
      {children}
    </AuthContext>
  );
};

export { AuthContext, AuthProvider };
