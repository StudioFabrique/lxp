/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des dépendances nécessaires
import useHttp from "../../../hooks/use-http";
import type { Activity } from "../../../utils/interfaces/activity";
import { useParams } from "react-router";
import VideoEditor from "./video-editor";
import toast from "react-hot-toast";
import { useState, useCallback, useEffect } from "react";
import VideoPlayer from "../../UI/video-player";

// Interface définissant les props du composant Video
interface VideoProps {
  activity?: Activity; // Activité vidéo optionnelle
  onCancel: () => void; // Fonction appelée lors de l'annulation
  isEditing: boolean; // État d'édition
}

// Fonction utilitaire pour valider les URLs YouTube
const isValidYouTubeUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return pattern.test(url);
};

export default function Video({ activity, onCancel, isEditing }: VideoProps) {
  // Récupération de l'ID de la leçon depuis les paramètres d'URL
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const [loading, setLoading] = useState(false);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = useCallback(
    async (value: {
      title: string;
      description: string | null;
      videoValue: string;
      fileValue: File | null;
    }) => {
      // Validation de l'URL YouTube si c'est une vidéo externe
      if (
        value.videoValue &&
        !value.fileValue &&
        !isValidYouTubeUrl(value.videoValue)
      ) {
        toast.error("URL YouTube invalide");
        return;
      }

      setLoading(true);

      // Préparation des données à envoyer
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          title: value.title,
          description: value.description,
          url: value.fileValue ? "" : value.videoValue,
        }),
      );

      // Ajout du fichier vidéo si présent
      if (value.fileValue) {
        fd.append("video", value.fileValue);
      }
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
          onCancel();
        }
      };
      sendRequest(
        {
          path: `/activity/video/${activity?.id ?? lessonId}`,
          method: activity ? "put" : "post", // PUT si modification, POST si création
          body: fd,
        },
        applyData,
      );
    },
    [activity, lessonId, onCancel, sendRequest],
  );

  // Fonction pour rendre le contenu approprié selon le contexte
  const renderContent = () => {
    // Mode édition d'une activité existante
    if (activity && isEditing) {
      return (
        <VideoEditor
          propVideo={activity.url}
          title={activity.title ?? ""}
          description={activity.description ?? ""}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      );
    }

    // Mode visualisation d'une activité existante
    if (activity && !isEditing) {
      return (
        <VideoPlayer
          source={activity.url}
          title={activity.title!}
          description={activity.description}
        />
      );
    }

    // Mode création d'une nouvelle activité
    return (
      <VideoEditor
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
      />
    );
  };

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <main className="w-full flex justify-center mt-4">{renderContent()}</main>
  );
}
