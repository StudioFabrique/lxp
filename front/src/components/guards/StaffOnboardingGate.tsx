import { useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";
import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import { dashboardIAApi } from "../../features/dashboard-ia/api/dashboardIA.api";
import { staffOnboardingApi } from "../../features/auth/api/staff-onboarding.api";
import Loader from "../loaders/Loader";

export default function StaffOnboardingGate({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const rank = user?.roles?.[0]?.rank;
  const admin = useQuery({ queryKey: ["staff-onboarding"], queryFn: staffOnboardingApi.get, enabled: !demoMode && rank === 1 });
  const teacher = useQuery({ queryKey: ["dropout-preferences"], queryFn: dashboardIAApi.queries.getDropoutPreferences, enabled: !demoMode && rank === 2 });
  if (!demoMode && ((rank === 1 && admin.isPending) || (rank === 2 && teacher.isPending))) return <Loader />;
  if (!demoMode && ((rank === 1 && admin.isError) || (rank === 2 && teacher.isError)))
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4" role="alert">
      <p>Impossible de vérifier votre accueil.</p>
      <button type="button" className="btn btn-primary" onClick={() => void (rank === 1 ? admin.refetch() : teacher.refetch())}>Réessayer</button>
    </div>;
  if (!demoMode && ((rank === 1 && admin.data?.required) || (rank === 2 && teacher.data?.onboardingRequired)))
    return <Navigate to="/staff/onboarding" replace />;
  return children;
}
