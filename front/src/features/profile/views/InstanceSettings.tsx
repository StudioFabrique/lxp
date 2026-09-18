import { useContext } from "react";
import { Settings } from "lucide-react";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import RecommendedActionTour from "../../../components/guided-tour/RecommendedActionTour";
import { logoTourSteps } from "../../../components/guided-tour/recommended-action-tour-steps";
import { AuthContext } from "../../../store/AuthProvider";
import InstanceGeneralSettings from "../components/instance-general-settings";

export default function InstanceSettings() {
  const { user } = useContext(AuthContext);
  if (user?.roles?.[0]?.rank !== 0) {
    return (
      <p role="alert">Vous n’avez pas accès aux paramètres de l’instance.</p>
    );
  }

  return (
    <PageWrapper>
      <Header
        title="Paramètres de l’instance"
        description="Personnalisez l’identité et l’accueil de votre organisme."
        icon={Settings}
      />
      <div className="flex w-full flex-col gap-4">
        <InstanceGeneralSettings />
      </div>
      <RecommendedActionTour tutorial="logo" steps={logoTourSteps} />
    </PageWrapper>
  );
}
