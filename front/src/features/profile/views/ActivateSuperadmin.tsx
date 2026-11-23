import { useContext } from "react";
import { ShieldCheck } from "lucide-react";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { AuthContext } from "../../../store/AuthProvider";
import { useDemoMode } from "../../../store/DemoContext";
import PromoteToRoot from "../components/account/promote-to-root";

export default function ActivateSuperadmin() {
  const { user } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  if (demoMode || user?.roles?.[0]?.rank !== 1 || user.roles[0].role !== "admin") {
    return (
      <p role="alert">Cette action n’est pas disponible pour votre compte.</p>
    );
  }

  return (
    <PageWrapper>
      <Header
        title="Activer le rôle superadmin"
        description="Utilisez une clé d’activation pour attribuer le rôle superadmin à votre compte."
        icon={ShieldCheck}
      />
      <PromoteToRoot />
    </PageWrapper>
  );
}
