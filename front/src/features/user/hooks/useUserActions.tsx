import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userMutations } from "../user.api";

export function useUserActions(onSuccessCallback: () => void) {
  const deleteOneMutation = useMutation({
    mutationFn: (id: string) => userMutations.deleteOne(id),
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      onSuccessCallback();
    },
  });

  const handleDeleteOne = (id: string) => {
    deleteOneMutation.mutate(id);
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      userMutations.updateUserStatus(id, value),
    onSuccess: () => {
      onSuccessCallback();
    },
  });

  const handleUpdateStatus = (id: string, value: boolean) => {
    updateStatusMutation.mutate({ id, value });
  };

  const updateManyStatusMutation = useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[];
      status: string;
    }) => userMutations.updateManyStatus(ids, status),
    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
      onSuccessCallback();
    },
  });

  const handleUpdateManyStatus = (ids: string[], status: string) => {
    updateManyStatusMutation.mutate({ ids, status });
  };

  const updateRolesMutation = useMutation({
    mutationFn: ({
      userIds,
      roleIds,
    }: {
      userIds: string[];
      roleIds: string[];
    }) => userMutations.updateUserRoles(userIds, roleIds),
    onSuccess: () => {
      toast.success("Rôles mis à jour avec succès");
      onSuccessCallback();
    },
  });

  const handleUpdateRoles = (userIds: string[], roleIds: string[]) => {
    updateRolesMutation.mutate({ userIds, roleIds });
  };

  const sendInvitationMutation = useMutation({
    mutationFn: (userId: string) => userMutations.sendInvitation(userId),
    onSuccess: () => {
      toast.success("Invitation envoyée");
      onSuccessCallback();
    },
  });

  const handleSendInvitation = (userId: string) => {
    sendInvitationMutation.mutate(userId);
  };

  const sendManyInvitationsMutation = useMutation({
    mutationFn: (userIds: string[]) =>
      userMutations.sendManyInvitations(userIds),
    onSuccess: () => {
      toast.success("Invitations envoyées");
      onSuccessCallback();
    },
  });

  const handleSendManyInvitations = (userIds: string[]) => {
    sendManyInvitationsMutation.mutate(userIds);
  };

  return {
    onDeleteOne: handleDeleteOne,
    isDeleting: deleteOneMutation.isPending,
    onUpdateStatus: handleUpdateStatus,
    onUpdateManyStatus: handleUpdateManyStatus,
    onUpdateRoles: handleUpdateRoles,
    onSendInvitation: handleSendInvitation,
    onSendManyInvitations: handleSendManyInvitations,
    isPending:
      deleteOneMutation.isPending ||
      updateStatusMutation.isPending ||
      updateManyStatusMutation.isPending ||
      updateRolesMutation.isPending ||
      sendInvitationMutation.isPending ||
      sendManyInvitationsMutation.isPending,
  };
}
