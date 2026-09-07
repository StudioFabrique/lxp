import { useNavigate, useSearchParams } from "react-router";
import AdminSignInForm from "../components/AdminSignInForm";
import AuthPageWrapper from "../components/AuthPageWrapper";

const CreateRoot = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? "";

  if (!token || !email) {
    return (
      <AuthPageWrapper title="Invitation incomplète">
        <p className="text-sm text-error">
          Le lien de création du compte root est invalide.
        </p>
      </AuthPageWrapper>
    );
  }

  return (
    <AdminSignInForm
      token={token}
      email={email}
      mode="additional"
      onSuccess={() => navigate("/")}
    />
  );
};

export default CreateRoot;
