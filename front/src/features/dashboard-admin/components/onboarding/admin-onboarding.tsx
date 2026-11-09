import { useContext } from "react";
import { AuthContext } from "../../../../store/AuthProvider";
import type { FormationParcoursSummary } from "../../interfaces/parcours-summary";
import { buildOnboardingSteps } from "./build-onboarding-steps";
import OnboardingChecklist from "./onboarding-checklist";
import { useSkippedOnboardingSteps } from "./use-skipped-onboarding-steps";

type Props = {
  isTeacher: boolean;
  formations: FormationParcoursSummary[];
  modulesCount: number;
  teachersCount?: number;
  studentsCount?: number;
  groupsCount?: number;
  canAddAdmin?: boolean;
  adminsCount?: number;
  onCreateFormation: () => void;
  onCreateParcours: () => void;
};

/** État vide du tableau de bord : checklist de mise en route, repliée sur l'étape à faire. */
export default function AdminOnboarding({
  isTeacher,
  formations,
  modulesCount,
  teachersCount,
  studentsCount,
  groupsCount,
  canAddAdmin = false,
  adminsCount,
  onCreateFormation,
  onCreateParcours,
}: Props) {
  const { user } = useContext(AuthContext);
  const { skipped, skip } = useSkippedOnboardingSteps(user?._id);
  const steps = buildOnboardingSteps({
    isTeacher,
    formations,
    modulesCount,
    teachersCount,
    studentsCount,
    groupsCount,
    canAddAdmin,
    adminsCount,
  }).filter((step) => !(step.isOptional && skipped.includes(step.id)));

  return (
    <div className="px-2 pt-2">
      <OnboardingChecklist
        steps={steps}
        onSkip={skip}
        onCreateFormation={onCreateFormation}
        onCreateParcours={onCreateParcours}
      />
    </div>
  );
}
