import { useNavigate, useSearchParams } from "react-router";
import AdminSignInForm from "../components/AdminSignInForm";

const CreateRoot = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const email = searchParams.get("email")?.trim() ?? "";

  if (!token || !email) {
    return (
      <div className="my-auto text-center">
        <h1 className="mb-3 text-xl font-bold text-base-content">
          Invitation incomplète
        </h1>
        <p className="text-sm text-error">
          Le lien de création du compte root est invalide.
        </p>
      </div>
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
