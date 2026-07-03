import { Suspense } from "react";
import Loader from "../components/loaders/Loader";

// Permet d'enrober n'importe quel composant lazy-loadé proprement
// exemple : const Login = lazy(() => import("./views/Login"));
//           { path: "/login", element: withSuspense(Login) },
export const withSuspense = (Component: React.ElementType) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);
