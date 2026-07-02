import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Évite de re-télécharger les données à chaque fois changement d'onglet
      retry: 1, // Si une requête échoue, TanStack la retente 1 seule fois avant d'afficher l'erreur
    },
  },
});
