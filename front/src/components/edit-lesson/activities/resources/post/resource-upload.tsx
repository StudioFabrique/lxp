/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import useUploadResources from "./useUploadResources";
import ResourceForm from "./resource-form";
import ResourcesAction from "./resource-actions";
import ResourcesList from "./resources-list";

type Props = {
  onCancel: (value: boolean) => void; // Fonction pour annuler l'upload
  onResetForm: () => void; // Fonction pour réinitialiser le formulaire
};

/**
 * Composant pour gérer l'upload de ressources
 * @param onCancel - Fonction appelée pour annuler l'upload
 */
export default function ResourceUpload({ onCancel }: Props) {
  // Récupération des fonctions et données du hook personnalisé
  const {
    data, // Données du formulaire (valeurs, erreurs, fonction de modification)
    filesList, // Liste des fichiers à uploader
    filesNumber, // Nombre de fichiers dans la liste
    handleFileChange, // Gestion du changement de fichier
    handleRemoveResource, // Suppression d'un fichier de la liste
    handleReorder, // Mise à jour de l'ordre des fichiers
    handleSubmit, // Soumission du formulaire
    isLoading, // État de chargement
    resetFilesList, // Réinitialisation de la liste des fichiers
    uploadProgress, // Progression de l'upload
    cancelUpload, // Nouvelle fonction
    hasError,
  } = useUploadResources(onCancel);

  useEffect(() => {
    // Fonction qui sera appelée avant que l'utilisateur ne quitte la page
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Annule la fermeture par défaut et affiche un message
      event.preventDefault();
      event.returnValue = "Êtes-vous sûr de vouloir quitter ?";
    };

    // Ajoute l'écouteur d'événement
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Nettoie l'écouteur quand le composant est démonté
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    // Layout principal en grille avec 2 colonnes sur xl
    <section className="grid xl:grid-cols-2 gap-4">
      {/* Colonne de gauche : formulaire et actions */}
      <article className="flex flex-col gap-y-4">
        <ResourceForm
          data={{
            ...data,
            errors: { name: data.errors.map((e) => e.message) },
          }}
          onFileChange={handleFileChange}
        />
        <ResourcesAction
          onCancel={onCancel}
          resetFilesList={resetFilesList}
          filesNumber={filesNumber}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          cancelUpload={cancelUpload}
          hasError={hasError}
        />
      </article>
      {/* Colonne de droite : liste des fichiers */}
      <article>
        {filesList ? (
          <ResourcesList
            filesList={filesList}
            handleRemoveResource={handleRemoveResource}
            isLoading={isLoading}
            onReorder={handleReorder}
            uploadProgress={uploadProgress}
          />
        ) : null}
      </article>
    </section>
  );
}
