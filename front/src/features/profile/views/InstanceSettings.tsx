import { useContext } from "react";
import PageWrapper from "../../../components/wrappers/PageWrapper";
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
      <InstanceGeneralSettings />
    </PageWrapper>
  );
}
