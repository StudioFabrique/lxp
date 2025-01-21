// Imports nécessaires pour la gestion des routes et des états
import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";

// Hook personnalisé pour gérer l'aperçu des leçons
const useLessonsPreview = () => {
  const { sendRequest, isLoading } = useHttp(true);

  // Récupération des paramètres d'URL
  const { state: stateFromUrl } = useLocation();
  const { moduleId } = useParams();

  // Stockage des données du module et de la leçon sélectionnée
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  useEffect(() => {
    // Fonction pour traiter les données reçues de l'API
    const applyData = (data: { data: Module }) => {
      setModuleData(data.data);

      // Si un ID de leçon est présent dans l'URL, sélectionner la leçon correspondante
      if (stateFromUrl?.lessonId) {
        const lessonToSelect = data.data.courses
          .map((course) => {
            return course.lessons.find(
              (lesson) => lesson.id === stateFromUrl.lessonId,
            );
          })
          .filter((course) => course !== undefined)[0];

        setSelectedLesson(lessonToSelect);
      }
    };

    // Requête HTTP pour récupérer les détails du module
    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      applyData,
    );
  }, [moduleId, sendRequest, stateFromUrl?.lessonId]);

  // Retourne les états et fonctions nécessaires
  return {
    moduleData,
    selectedLesson,
    setModuleData,
    setSelectedLesson,
    isLoading,
  };
};

export default useLessonsPreview;
