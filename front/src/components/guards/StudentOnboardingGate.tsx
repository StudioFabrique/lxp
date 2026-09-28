import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import {
  learningProfileApi,
  learningProfileKey,
} from "../../features/learning-profile/learning-profile.api";
import AppLoadingSkeleton from "../loaders/AppLoadingSkeleton";

/** Checks the student's onboarding before mounting the layout and its sidebar. */
export default function StudentOnboardingGate() {
  const { isAppInitialized, isLoggedIn, user } = useContext(AuthContext);
  const { demoMode, isConfigLoaded } = useDemoMode();
  const shouldCheck =
    isAppInitialized && isConfigLoaded && isLoggedIn &&
    user?.roles?.[0]?.rank === 3 && !demoMode;
  const learningContext = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
    enabled: shouldCheck,
  });

  if (!isAppInitialized || !isConfigLoaded) return <AppLoadingSkeleton />;
  if (!shouldCheck) return <Outlet />;
  if (learningContext.isPending) return <AppLoadingSkeleton />;
  if (learningContext.isError) return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-100 px-6 text-center" role="alert">
      <p>Impossible de vérifier votre accueil.</p>
      <button type="button" className="btn btn-primary" onClick={() => void learningContext.refetch()}>
        Réessayer
      </button>
    </main>
  );
  if (learningContext.data.onboardingRequired && learningContext.data.shouldAutoRedirect)
    return <Navigate to="/student/onboarding" replace />;
  return <Outlet />;
}
