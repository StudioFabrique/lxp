/* eslint-disable @typescript-eslint/no-explicit-any */
// Import des dépendances nécessaires
import { useCallback, useContext, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Import des composants et du contexte
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import { Socket } from "socket.io-client";
import Login from "../../components/login/login.component";
import { Context } from "../../store/context.store";
//import DrawerChatbot from "../../components/chatbot/DrawerChatbot";

// Variables globales pour le state initial et le socket
let initialState = true;
let socket: Socket | undefined;

// Composant principal de mise en page racine
const RootLayout = () => {
  // Récupération du contexte et des hooks de navigation
  const { user, initTheme, isLoggedIn, handshake } = useContext(Context);
  const nav = useNavigate();
  const location = useLocation();

  // Mémorisation du rôle et du rang
  const userRole = useMemo(() => user?.roles?.[0], [user?.roles]);
  const userRank = useMemo(() => userRole?.rank, [userRole]);

  // Mémorisation de la logique de redirection
  const handleRedirection = useCallback(() => {
    if (!isLoggedIn || !userRank || location.pathname.split("/").length >= 3)
      return;

    if (userRank < 3) {
      nav("/admin");
    } else if (userRank > 2) {
      nav("/student");
    }
  }, [isLoggedIn, userRank, location.pathname, nav]);

  // Effet pour la redirection et les rôles
  useEffect(() => {
    if (!isLoggedIn || !userRole) return;
    //fetchRoles(userRole);
    handleRedirection();
  }, [isLoggedIn, userRole, handleRedirection]);

  // Effet pour l'initialisation
  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [isLoggedIn, initTheme, handshake]);

  // Effet pour déconnecter le socket quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isLoggedIn && socket) {
      socket.disconnect();
    }
  }, [isLoggedIn, nav]);

  // Affichage de la page de connexion si non connecté
  if (!isLoggedIn) {
    return <Login />;
  }

  // Rendu du layout principal avec animation de transition
  return (
    <FadeWrapper>
      <div className="h-screen w-full p-2 overflow-clip">
        <Outlet />
      </div>
      {/* <DrawerChatbot /> */}
    </FadeWrapper>
  );
};

export default RootLayout;
