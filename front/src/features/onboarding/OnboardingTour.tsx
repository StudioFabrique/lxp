import { type PropsWithChildren, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import { dashboardAdminApi } from "../dashboard-admin/api/dashboard-admin.api";
import { resolveOnboardingFlow } from "./onboarding-flow";
import { type Layout } from "./OnboardingTour.types";
import { InertOnboarding } from "./InertOnboarding";
import { OnboardingTourContent } from "./OnboardingTourContent";

const OnboardingTour = ({
  layout,
  children,
  enabled = true,
}: PropsWithChildren<{ layout: Layout; enabled?: boolean }>) => {
  const { user } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const userRank = user?.roles.length
    ? (user.roles[0]?.rank ?? 4)
    : 4;
  const staffParcours = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
    enabled: layout === "admin" && Boolean(user) && !demoMode,
  });
  const flow = useMemo(
    () => resolveOnboardingFlow(layout, userRank, staffParcours.data ?? []),
    [layout, staffParcours.data, userRank],
  );
  const isEligibilityResolved =
    layout === "student" || demoMode || !staffParcours.isLoading;

  if (demoMode || !enabled) return <InertOnboarding>{children}</InertOnboarding>;
  // À la déconnexion, la barre latérale peut rester montée pendant le rendu où
  // `user` vient de passer à null. Le contexte inerte évite que ses composants
  // consommateurs se retrouvent momentanément hors fournisseur.
  if (!user) return <InertOnboarding>{children}</InertOnboarding>;

  return (
    <OnboardingTourContent
      key={user._id}
      layout={layout}
      flow={flow}
      isEligibilityResolved={isEligibilityResolved}
      initialOnboarding={
        user.onboarding ?? {
          status: "pending",
          step: "",
          version: 1,
        }
      }
    >
      {children}
    </OnboardingTourContent>
  );
};

export default OnboardingTour;
