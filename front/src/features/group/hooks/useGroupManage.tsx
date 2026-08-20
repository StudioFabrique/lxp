import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type User from "../../../../src/utils/interfaces/user";
import { groupApi } from "../api/group.api";
import { userApi } from "../../user/api/user.api";
import type { GroupFormValues } from "../group.schema";
import {
  createStudentUrlFromGroup,
  readGroupFormDraft,
} from "../helpers/group-form-draft";
import useGroupForm from "../components/group-form/useGroupForm";
import toast from "react-hot-toast";
import {
  getApiErrorMessage,
  isConflictError,
} from "../../../utils/helpers/api-error-message";

const mergeUsers = (currentUsers: User[], usersToAdd: User[]) => {
  const usersById = new Map(currentUsers.map((user) => [user._id, user]));
  usersToAdd.forEach((user) => usersById.set(user._id, user));
  return [...usersById.values()];
};

function useGroupManage() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [managedUsers, setManagedUsers] = useState<User[] | null>(null);
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");
  const searchParamsString = searchParams.toString();
  const draft = useMemo(
    () => readGroupFormDraft(new URLSearchParams(searchParamsString)),
    [searchParamsString],
  );

  const { data: existingGroup, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: () => groupApi.queries.getById(id!),
    enabled: !!id,
  });

  const form = useGroupForm({
    group: existingGroup,
    draft,
    sourceParcoursId: fromParcours ? Number(fromParcours) : undefined,
  });

  const draftStudentIds = draft.studentIds;
  const {
    data: draftUsers,
    isLoading: isLoadingDraftUsers,
  } = useQuery({
    queryKey: ["group-form", "draft-users", draftStudentIds],
    queryFn: () => userApi.queries.getUsersByIds(draftStudentIds ?? []),
    enabled: draftStudentIds !== undefined && draftStudentIds.length > 0,
  });

  const initialUsers = useMemo(() => {
    if (draftStudentIds !== undefined) {
      if (draftStudentIds.length === 0) return [];
      return (draftUsers ?? []).map((user) =>
        draft.activeStudentIds !== undefined
          ? {
              ...user,
              isActive: draft.activeStudentIds.includes(user._id),
            }
          : user,
      );
    }
    return existingGroup?.users ?? [];
  }, [draft.activeStudentIds, draftStudentIds, draftUsers, existingGroup?.users]);
  const usersToAdd = managedUsers ?? initialUsers;

  const handleNavigateAfterSubmit = useCallback(() => {
    if (fromParcours) {
      navigate(`/admin/parcours/edit/${fromParcours}?step=6`);
    } else {
      navigate("/admin/group", {
        state: {
          toastFrom: id
            ? "Groupe modifié avec succès"
            : "Groupe créé avec succès",
        },
      });
    }
  }, [fromParcours, navigate, id]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (id) {
        return groupApi.mutations.update(id, formData);
      }
      return groupApi.mutations.create(formData);
    },
    onSuccess: handleNavigateAfterSubmit,
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        id
          ? "Le groupe n'a pas pu être modifié."
          : "Le groupe n'a pas pu être créé.",
      );

      toast.error(message);

      // Un nom déjà pris est le seul conflit possible sur ces routes : le
      // message est rattaché au champ, sinon le formulaire semblait
      // simplement ne rien faire une fois le toast disparu.
      if (isConflictError(error)) {
        form.setError("name", { type: "server", message });
      }
    },
  });

  const handleSubmit = (data: GroupFormValues) => {
    form.clearErrors("name");

    const usersIdWithActiveState = usersToAdd.map((user) => ({
      _id: user._id,
      isActive: user.isActive,
    }));

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        group: {
          _id: existingGroup?._id,
          name: data.name,
          desc: data.desc,
        },
        parcoursId: data.parcoursId,
        users: usersIdWithActiveState,
      }),
    );

    mutation.mutate(formData);
  };

  const handleAddUsers = (users: Array<User>) => {
    setManagedUsers((currentUsers) =>
      mergeUsers(currentUsers ?? initialUsers, users),
    );
  };

  const handleDeleteUser = (user: User) => {
    setManagedUsers((currentUsers) =>
      (currentUsers ?? initialUsers).filter(
        (userToAdd) => userToAdd._id !== user._id,
      ),
    );
  };

  const handleCreateStudent = () => {
    navigate(
      createStudentUrlFromGroup({
        pathname,
        currentSearchParams: searchParams,
        values: form.getValues(),
        students: usersToAdd.map((user) => ({
          id: user._id,
          isActive: user.isActive,
        })),
      }),
    );
  };

  return {
    form,
    existingGroup,
    isEditing: Boolean(id),
    usersToAdd,
    isLoading: isLoading || isLoadingDraftUsers || mutation.isPending,
    onSubmit: handleSubmit,
    onAddUsers: handleAddUsers,
    onDeleteUser: handleDeleteUser,
    onCreateStudent: handleCreateStudent,
  };
}

export default useGroupManage;
