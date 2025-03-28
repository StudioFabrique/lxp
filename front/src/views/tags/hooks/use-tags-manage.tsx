/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import User from "../../../utils/interfaces/user";
import Tag from "../../../utils/interfaces/tag";

/**
 * Hook personnalisé pour gérer la création et la modification des tags
 * Gère l'état des utilisateurs, la soumission du formulaire et les interactions CRUD
 */
function useTagManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttp(true);
  const [usersToAdd, setUsersToAdd] = useState<Array<User>>([]);
  const [submitMethod, setSubmitMethod] = useState<"put" | "post">("post");
  const [existingTag, setExistingTag] = useState<Tag>();
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  /**
   * Gère la soumission du formulaire de tag
   * @param data - Les données du formulaire
   * @param file - Le fichier image associé au tag
   */
  const handleSubmit = (data: any, file: File) => {
    const applyData = (_data: any) => {
      if (fromParcours) navigate(`/admin/parcours/edit/${fromParcours}?step=6`);
      else
        navigate("/admin/tag", {
          state: {
            toastFrom:
              submitMethod === "post"
                ? "Tag créé avec succès"
                : "Tag modifié avec succès",
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
        path: submitMethod === "post" ? "/tag" : `/tag/${id}`,
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
   * Récupère les données d'un tag existant depuis le serveur
   */
  const getExistingTag = useCallback(() => {
    const applyData = (data: { data: Tag }) => {
      // setExistingTag(data.data);
      // setUsersToAdd(data.data.users ?? []);
    };
    sendRequest({ path: `/tag/${id}` }, applyData);
  }, [id, sendRequest]);

  /**
   * Effet qui s'exécute quand un ID est présent
   * Configure le mode édition et récupère les données du tag
   */
  useEffect(() => {
    if (id) {
      getExistingTag();
      setSubmitMethod("put");
    }
  }, [id, getExistingTag]);

  // Retourne les fonctions et états nécessaires
  return {
    existingTag,
    usersToAdd,
    isLoading,
    onSubmit: handleSubmit,
    onAddUsers: handleAddUsers,
    onUpdateUser: handleUpdateUser,
    onDeleteUser: handleDeleteUser,
  };
}

export default useTagManage;
