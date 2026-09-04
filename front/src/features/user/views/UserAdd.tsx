import { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm from "../components/user-form/UserForm";
import { userApi } from "../api/user.api";
import {
  addStudentToGroupReturnPath,
  getSafeGroupReturnPath,
} from "../../group/helpers/group-form-draft";
import {
  getApiErrorMessage,
  isConflictError,
} from "../../../utils/helpers/api-error-message";
import { AuthContext } from "../../../store/AuthProvider";
import RecommendedActionTour from "../../../components/guided-tour/RecommendedActionTour";
import { getUserCreationTourSteps } from "../../../components/guided-tour/recommended-action-tour-steps";

const UserAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const returnTo = searchParams.get("returnTo");
  const safeReturnTo = getSafeGroupReturnPath(returnTo);
  const requestedRoleRank = Number(searchParams.get("roleRank"));
  const currentUserRank = user?.roles.length
    ? Math.min(...user.roles.map(({ rank }) => rank), 4)
    : 4;
  const initialRoleRank =
    [1, 2, 3].includes(requestedRoleRank) &&
    requestedRoleRank > currentUserRank
      ? requestedRoleRank
      : safeReturnTo && searchParams.get("roleRank") === "3"
        ? 3
        : undefined;
  const initialSendEmail = searchParams.get("invite") === "true";
  const tutorial = searchParams.get("tutorial");
  const tutorialRole =
    tutorial === "teacher"
      ? { id: "teacher", label: "équipe pédagogique" }
      : tutorial === "admin"
        ? { id: "admin", label: "administrateur" }
        : tutorial === "student"
          ? { id: "student", label: "apprenant" }
          : null;

  // Le message du serveur est relayé au formulaire, qui le signale à la fois
  // en toast et sous le champ concerné quand il porte sur l'email.
  const [submitError, setSubmitError] = useState<{
    message: string;
    conflictingEmail: string | null;
  } | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userData,
      file,
    }: {
      userData: Record<string, unknown>;
      file: File | null;
    }) => userApi.mutations.create(userData, file),
    onSuccess: (data) => {
      toast.success(data.message ?? "Utilisateur créé avec succès");
      const groupReturnPath = data.userId
        ? addStudentToGroupReturnPath(safeReturnTo, data.userId)
        : safeReturnTo;
      navigate(groupReturnPath ?? "/admin/user");
    },
    onError: (error, variables) => {
      // Sur ces deux routes, un 409 ne peut venir que de l'adresse email :
      // le message est donc aussi épinglé sous le champ, avec l'adresse
      // refusée pour que la correction fasse disparaître le repère.
      setSubmitError({
        message: getApiErrorMessage(error, "L'utilisateur n'a pas pu être créé."),
        conflictingEmail: isConflictError(error)
          ? String(variables.userData.email ?? "")
          : null,
      });
    },
  });

  const handleSubmit = (
    userData: Record<string, unknown>,
    file: File | null,
  ) => {
    setSubmitError(null);
    mutate({ userData, file });
  };

  return (
    <>
      <UserForm
        onSubmitForm={handleSubmit}
        error={submitError?.message}
        emailConflict={
          submitError?.conflictingEmail
            ? {
                email: submitError.conflictingEmail,
                message: submitError.message,
              }
            : undefined
        }
        isLoading={isPending}
        initialRoleRank={initialRoleRank}
        initialSendEmail={initialSendEmail}
        cancelTo={safeReturnTo ?? undefined}
      />
      {tutorialRole ? (
        <RecommendedActionTour
          tutorial={tutorialRole.id}
          steps={getUserCreationTourSteps(
            tutorialRole.label,
            initialSendEmail,
          )}
        />
      ) : null}
    </>
  );
};

export default UserAdd;
