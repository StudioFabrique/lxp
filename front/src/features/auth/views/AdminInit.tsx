import { useNavigate, useSearchParams } from "react-router";
import AdminSignInForm from "../components/AdminSignInForm";

const AdminInit = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitedToken = searchParams.get("token")?.trim() ?? "";
  const invitedEmail = searchParams.get("email")?.trim() ?? "";

  if (invitedToken && invitedEmail) {
    return (
      <AdminSignInForm
        token={invitedToken}
        email={invitedEmail}
        onSuccess={() => navigate("/")}
      />
    );
  }

  return (
    <div className="my-auto text-center">
      <h1 className="mb-3 text-xl font-bold text-base-content">
        Invitation requise
      </h1>
      <p className="text-sm text-base-content/70">
        La création du premier compte root nécessite le lien personnel envoyé
        par email lors du déploiement.
      </p>
    </div>
  );
};

export default AdminInit;
