/* eslint-disable @typescript-eslint/no-explicit-any */
// Import des dépendances nécessaires
import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Import des composants et du contexte
import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import { Socket } from "socket.io-client";
import Login from "../../components/login/login.component";

// Variables globales pour le state initial et le socket
let initialState = true;
let socket: Socket;

// Composant principal de mise en page racine
const RootLayout = () => {
  // Récupération du contexte et des hooks de navigation
  const { user, fetchRoles, initTheme, isLoggedIn, handshake } =
    useContext(Context);
  const nav = useNavigate();
  const location = useLocation();

  console.log({ isLoggedIn, user });

  // Effet pour gérer la redirection selon le rôle de l'utilisateur
  useEffect(() => {
    if (isLoggedIn && user && user.roles) {
      // Récupération des rôles de l'utilisateur
      fetchRoles(user!.roles[0]);
      console.log(location.pathname.split("/"));

      // Redirection si l'utilisateur est à la racine
      if (location.pathname.split("/").length < 3) {
        // Redirection vers /admin pour les rangs < 3
        if (user && user.roles[0].rank < 3) {
          nav("/admin");
        }
        // Redirection vers /student pour les rangs > 2
        else if (user && user.roles[0].rank > 2) {
          nav("/student");
        }
      }
    }
  }, [fetchRoles, nav, user, isLoggedIn, location.pathname]);

  // Effet pour initialiser le thème et la connexion
  useEffect(() => {
    initTheme();
    // Établissement de la connexion initiale
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  // Effet pour déconnecter le socket quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isLoggedIn && socket !== undefined) {
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
      <div className="w-full">
        <Outlet />
      </div>
    </FadeWrapper>
  );
};

export default RootLayout;
