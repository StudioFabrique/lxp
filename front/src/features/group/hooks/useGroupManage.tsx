/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, useSearchParams } from "react-router";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import User from "../../../utils/interfaces/user";
import Group from "../../../utils/interfaces/group";

/**
 * Hook personnalisé pour gérer la création et la modification des groupes
 * Gère l'état des utilisateurs, la soumission du formulaire et les interactions CRUD
 */
function useGroupManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttp(true);
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);
  const [submitMethod, setSubmitMethod] = useState<"put" | "post">("post");
  const [existingGroup, setExistingGroup] = useState<Group>();
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  /**
   * Gère la soumission du formulaire de groupe
   * @param data - Les données du formulaire
   * @param file - Le fichier image associé au groupe
   */
  const handleSubmit = (data: any, file: File) => {
    const applyData = (_data: any) => {
      if (fromParcours) navigate(`/admin/parcours/edit/${fromParcours}?step=6`);
      else
        navigate("/admin/group", {
          state: {
            toastFrom:
              submitMethod === "post"
                ? "Groupe créé avec succès"
                : "Groupe modifié avec succès",
          },
        });
    };

    // Prépare les données des utilisateurs avec leur état actif
    const usersIdWithActiveState = usersToAdd.map((user) => ({
      _id: user._id,
      isActive: user.isActive,
    }));

    // Crée le FormData avec les données et l'image
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ ...data, users: usersIdWithActiveState }),
    );
    formData.append("image", file);

    // Envoie la requête au serveur
    sendRequest(
      {
        method: submitMethod,
        path: submitMethod === "post" ? "/group" : `/group/${id}`,
        body: formData,
      },
      applyData,
    );
  };

  /**
   * Ajoute de nouveaux utilisateurs à la liste
   * @param users - Tableau d'utilisateurs à ajouter
   */
  const handleAddUsers = (users: Array<User>) => {
    setUsersToAdd((currentUsers) => [...currentUsers, ...users]);
  };

  /**
   * Met à jour l'état d'un utilisateur dans la liste
   * @param user - L'utilisateur à mettre à jour
   */
  const handleUpdateUser = (user: User) => {
    setUsersToAdd((usersToAdd) =>
      usersToAdd.map((userToAdd) =>
        userToAdd._id === user._id
          ? { ...userToAdd, isActive: user.isActive }
          : userToAdd,
      ),
    );
  };

  /**
   * Supprime un utilisateur de la liste
   * @param user - L'utilisateur à supprimer
   */
  const handleDeleteUser = (user: User) => {
    setUsersToAdd((usersToAdd) =>
      usersToAdd.filter((userToAdd) => userToAdd._id !== user._id),
    );
  };

  /**
   * Récupère les données d'un groupe existant depuis le serveur
   */
  const getExistingGroup = useCallback(() => {
    const applyData = (data: { data: Group }) => {
      setExistingGroup(data.data);
      setUsersToAdd(data.data.users ?? []);
    };
    sendRequest({ path: `/group/${id}` }, applyData);
  }, [id, sendRequest]);

  /**
   * Effet qui s'exécute quand un ID est présent
   * Configure le mode édition et récupère les données du groupe
   */
  useEffect(() => {
    if (id) {
      getExistingGroup();
      setSubmitMethod("put");
    }
  }, [id, getExistingGroup]);

  // Retourne les fonctions et états nécessaires
  return {
    existingGroup,
    usersToAdd,
    isLoading,
    onSubmit: handleSubmit,
    onAddUsers: handleAddUsers,
    onUpdateUser: handleUpdateUser,
    onDeleteUser: handleDeleteUser,
  };
}

export default useGroupManage;
