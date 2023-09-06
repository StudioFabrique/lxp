import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import UserAddForm from "../../components/forms/user-form/user-add-form.component";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

const UserAdd = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const navigate = useNavigate();

  const handleSubmit = (user: any) => {
    console.log("event emit (form)");
    sendRequest({ method: "post", path: "/user", body: user }, (data: any) => {
      if (data)
        return navigate(
          { pathname: "/admin/user" },
          { state: { sucessToastMessage: "Utilisateur crée avec succès" } }
        );
    });
  };

  useEffect(() => {
    if (error) {
      toast.error("problème lors de la création de l'utilisateur");
    }
  }, [error]);

  return (
    <div className="p-10">
      <Toaster />
      <UserAddForm
        onSubmitForm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAdd;
