import { useState, useEffect, useCallback, useRef } from "react";
import useHttp from "../../../hooks/use-http";

import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import Parcours from "../../../utils/interfaces/parcours";
import Formation from "../../../utils/interfaces/formation";
import Module from "../../../utils/interfaces/module";
import { BASE_URL } from "../../../config/urls";
import { replaceActivityTextContent } from "../../../helpers/replaceActivityTextContent";
import { getMimeType, sanitizeFilename } from "../../../utils/import-mime";
import { parseCourseZip } from "../../../helpers/course-import-parser";

export enum CoursesImportStep {
  MbzImport,
  CoursesPreview,
  ParcoursSelection,
  ImportResult,
}

export type ActivityImport = Activity & {
  value?: string | Blob;
  hasError?: boolean;
};

export interface QueuedImage {
  file: File;
  blobUrl: string;
  size: "small" | "medium" | "large";
  tempId: string;
}

export type CourseImport = Course & {
  id: number;
  hasError?: boolean;
  lessons: (Lesson & {
    id: number;
    hasError?: boolean;
    isSelected: boolean;
    activities: ActivityImport[];
  })[];
  parcours?: Parcours;
  parcoursId?: number;
  moduleId?: number;
};

export default function useImportCourses() {
  const { sendRequest } = useHttp();

  // Navigation Data
  const [step, setImportStep] = useState<CoursesImportStep>(
    CoursesImportStep.MbzImport,
  );

  const [importedCourses, setImportedCourses] = useState<CourseImport[]>();
  const imagesQueue = useRef<QueuedImage[]>([]);

  // Selection Data
  const [formationsList, setFormationsList] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null,
  );
  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);
  const [selectedParcours, setSelectedParcours] = useState<Parcours | null>(
    null,
  );
  const [modulesList, setModulesList] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tooltipErrorTip, setTooltipErrorTip] = useState<string>("");

  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");

  /**
   * INTERACTION AVEC LE NOUVEAU ENDPOINT BACKEND :
   * Envoie le .mbz brut, reçoit un flux binaire ZIP, puis le transmet au service de parsing.
   */
  const handleImportMbz = useCallback(async (file: File) => {
    setError("");
    setTooltipErrorTip("");
    setIsLoading(true);
    setImportedCourses(undefined);
    imagesQueue.current = [];
    setCurrentAction(
      "Téléversement de l'archive Moodle (.mbz) et génération du contenu par l'IA...",
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Appel au endpoint Node personnalisé (utilisation de fetch pour le typage blob de la réponse binaire)
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/course/import-mbz`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(
          errJson.error ||
            "Échec du traitement de l'archive MBZ par le serveur backend.",
        );
      }

      setCurrentAction(
        "Package de cours généré. Analyse binaire de la structure...",
      );
      const zipBlob = await response.blob();

      // Utilisation du service extrait
      const {
        courses,
        images,
        error: parseError,
        tooltipErrorTip: parseTooltip,
      } = await parseCourseZip(zipBlob);

      if (parseError) setError(parseError);
      if (parseTooltip) setTooltipErrorTip(parseTooltip);

      setImportedCourses(courses);
      imagesQueue.current = images;
      setImportStep(CoursesImportStep.CoursesPreview);
    } catch (e: any) {
      console.error(`Erreur import mbz:`, e);
      setError(
        e.message ||
          "Une erreur est survenue lors de l'intégration de votre cours.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * PARSING TRADITIONNEL D'UN ZIP LOCAL
   */
  const handleImportZip = useCallback(async (file: File) => {
    setError("");
    setTooltipErrorTip("");
    setIsLoading(true);
    setImportedCourses(undefined);
    imagesQueue.current = [];

    try {
      const {
        courses,
        images,
        error: parseError,
        tooltipErrorTip: parseTooltip,
      } = await parseCourseZip(file);

      if (parseError) setError(parseError);
      if (parseTooltip) setTooltipErrorTip(parseTooltip);

      setImportedCourses(courses);
      imagesQueue.current = images;
      setImportStep(CoursesImportStep.CoursesPreview);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Le fichier ZIP est corrompu ou ne possède pas d'index valide.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * ENVOI DES RESSOURCES BINAIRES D'ACTIVITÉS (PDF, DOCX, etc.)
   */
  const uploadActivityResource = useCallback(
    async (lessonId: number, file: File, title: string) => {
      try {
        const formData = new FormData();
        formData.append("files", file);
        const resourceData = {
          resources: [{ label: title, filename: file.name }],
          parent: "lesson",
        };
        formData.append("data", JSON.stringify(resourceData));

        await sendRequest({
          path: `/activity/resource/${lessonId}`,
          method: "post",
          body: formData,
        });
      } catch (e) {
        console.error(`Erreur upload ressource:`, e);
        throw e;
      }
    },
    [sendRequest],
  );

  /**
   * PROCESSUS DE PERSISTANCE DES STRUCURES ET MÉDIAS SUR LE SERVEUR DE DONNÉES SQL
   */
  const processImport = useCallback(async () => {
    if (!importedCourses) return;

    let processedCount = 0;
    let totalItems = 0;

    importedCourses.forEach((c) => {
      totalItems++;
      c.lessons.forEach((l) => {
        if (l.isSelected) {
          totalItems++;
          if (l.activities) totalItems += l.activities.length;
        }
      });
    });

    try {
      for (const course of importedCourses) {
        setCurrentAction(`Création du cours : ${course.title}`);
        await new Promise((r) => setTimeout(r, 50));

        const structurePayload = {
          title: course.title,
          description: course.description,
          moduleId: selectedModule?.id,
          parcoursId: selectedParcours?.id,
          lessons: course.lessons
            .filter((l) => l.isSelected)
            .map((l) => ({
              id: l.id,
              title: l.title,
              modalite: l.modalite,
              isSelected: true,
            })),
        };

        const structureResponse = await sendRequest({
          path: "/course/import-structure",
          method: "post",
          body: structurePayload,
        });

        processedCount += 1 + structurePayload.lessons.length;
        setUploadProgress((processedCount / totalItems) * 100);

        const {
          lessonsMap,
        }: { lessonsMap: { tempId: number; realId: number }[] } =
          structureResponse;

        for (const lesson of course.lessons) {
          if (!lesson.isSelected) continue;

          const mapping = lessonsMap.find((m) => m.tempId === lesson.id);
          if (!mapping) continue;
          const realLessonId = mapping.realId;

          for (const activity of lesson.activities) {
            setCurrentAction(`Traitement : ${activity.title}`);

            if (
              activity.type === "text" &&
              typeof activity.value === "string"
            ) {
              let finalHtml = activity.value;
              const imagesToProcess = imagesQueue.current.filter((img) =>
                finalHtml.includes(img.tempId),
              );

              if (imagesToProcess.length > 0) {
                for (let i = 0; i < imagesToProcess.length; i++) {
                  const img = imagesToProcess[i];
                  setCurrentAction(
                    `Upload image ${i + 1}/${imagesToProcess.length} pour : ${activity.title}`,
                  );
                  await new Promise((r) => setTimeout(r, 20));

                  try {
                    const formData = new FormData();
                    formData.append("image", img.file, img.file.name);

                    const response = await sendRequest({
                      path: "/activity/blog-image",
                      method: "post",
                      body: formData,
                    });

                    const serverUrl = response.response || response.url;
                    const fullUrl = serverUrl.startsWith("http")
                      ? serverUrl
                      : `${BASE_URL}${serverUrl}`;

                    finalHtml = finalHtml.split(img.blobUrl).join(fullUrl);
                    finalHtml = replaceActivityTextContent(finalHtml);
                  } catch (err) {
                    console.error("Erreur upload image blog", err);
                  }
                }
              }

              await sendRequest({
                path: `/activity/text/${realLessonId}`,
                method: "post",
                body: {
                  title: activity.title,
                  description: "",
                  value: finalHtml,
                  parent: "lesson",
                },
              });
            } else if (activity.value instanceof Blob) {
              setCurrentAction(`Téléversement ressource : ${activity.title}`);

              const rawName =
                activity.url.split("/").pop() || `${activity.title}.pdf`;
              const cleanName = sanitizeFilename(rawName);
              const mimeType = getMimeType(cleanName);

              const fileToSend = new File([activity.value], cleanName, {
                type: mimeType,
              });
              await uploadActivityResource(
                realLessonId,
                fileToSend,
                activity.title || cleanName,
              );
            }

            processedCount++;
            setUploadProgress((processedCount / totalItems) * 100);
          }
        }
      }

      setCurrentAction("Importation terminée avec succès !");
      setUploadProgress(100);
    } catch (globalError) {
      console.error(globalError);
      setError(
        "Une erreur critique est survenue pendant l'importation réseau.",
      );
      setCurrentAction("Erreur critique.");
      setIsLoading(false);
    }
  }, [
    importedCourses,
    selectedModule?.id,
    selectedParcours?.id,
    sendRequest,
    uploadActivityResource,
  ]);

  // --- Fonctions CRUD d'Arborescence & Commits Locaux ---

  const onRemoveCourse = (courseTitle: string) => {
    setImportedCourses(
      (prev) => prev?.filter((c) => c.title !== courseTitle) || undefined,
    );
  };

  const onRemoveActivity = (cId: number, lId: number, aId: number) => {
    setImportedCourses(
      (prev) =>
        prev?.map((c) =>
          c.id === cId
            ? {
                ...c,
                lessons: c.lessons.map((l) =>
                  l.id === lId
                    ? {
                        ...l,
                        activities:
                          l.activities?.filter((a) => a.id !== aId) || [],
                      }
                    : l,
                ),
              }
            : c,
        ) as CourseImport[],
    );
  };

  const onToggleLessonSelection = (courseId: number, lessonId: number) => {
    setImportedCourses(
      (prev) =>
        prev?.map((c) =>
          c.id === courseId
            ? {
                ...c,
                lessons: c.lessons.map((l) =>
                  l.id === lessonId ? { ...l, isSelected: !l.isSelected } : l,
                ),
              }
            : c,
        ) as CourseImport[],
    );
  };

  const onUpdateCourseTitle = (courseId: number, newTitle: string) => {
    setImportedCourses((prev) =>
      prev?.map((c) => (c.id === courseId ? { ...c, title: newTitle } : c)),
    );
  };

  const onUpdateLessonTitle = (cId: number, lId: number, title: string) => {
    setImportedCourses(
      (prev) =>
        prev?.map((c) =>
          c.id === cId
            ? {
                ...c,
                lessons: c.lessons.map((l) =>
                  l.id === lId ? { ...l, title } : l,
                ),
              }
            : c,
        ) as CourseImport[],
    );
  };

  const onUpdateActivityTitle = (
    cId: number,
    lId: number,
    aId: number,
    title: string,
  ) => {
    setImportedCourses(
      (prev) =>
        prev?.map((c) =>
          c.id === cId
            ? {
                ...c,
                lessons: c.lessons.map((l) =>
                  l.id === lId
                    ? {
                        ...l,
                        activities:
                          l.activities?.map((a) =>
                            a.id === aId ? { ...a, title } : a,
                          ) || [],
                      }
                    : l,
                ),
              }
            : c,
        ) as CourseImport[],
    );
  };

  const onConfirmImport = () => {
    if (importedCourses?.length)
      setImportStep(CoursesImportStep.ParcoursSelection);
  };

  const onConfirmParcoursSelection = () => {
    if (importedCourses) {
      const finalCourses = importedCourses
        .map((c) => ({ ...c, lessons: c.lessons.filter((l) => l.isSelected) }))
        .filter((c) => c.lessons.length > 0);
      setImportedCourses(finalCourses as CourseImport[]);
    }
    setImportStep(CoursesImportStep.ImportResult);
  };

  const onGoBack = () => {
    setImportStep((curr) =>
      curr <= CoursesImportStep.CoursesPreview ? curr : curr - 1,
    );
  };

  const fetchModules = useCallback(() => {
    if (selectedParcours) {
      setModulesList([]);
      setSelectedModule(null);
      sendRequest(
        { path: `/modules/${selectedParcours.id}`, method: "get" },
        (data) => setModulesList(data.modules),
      );
    }
  }, [selectedParcours, sendRequest]);

  // --- Effects de Synchronisation & Chargement des Données de Listes ---

  useEffect(() => {
    if (step === CoursesImportStep.ImportResult && importedCourses) {
      processImport();
    }
  }, [importedCourses, processImport, step]);

  useEffect(() => {
    if (step === CoursesImportStep.ParcoursSelection) {
      sendRequest({ path: "/formation" }, (data) => setFormationsList(data));
    }
  }, [step, sendRequest]);

  useEffect(() => {
    if (selectedFormation) {
      setParcoursList([]);
      setSelectedParcours(null);
      setModulesList([]);
      setSelectedModule(null);
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${selectedFormation.id}`,
          method: "get",
        },
        (data) => setParcoursList(data.data),
      );
    }
  }, [selectedFormation, sendRequest]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    step,
    importedCourses,
    isLoading,
    error,
    tooltipErrorTip,
    uploadProgress,
    currentAction,
    imagesQueue,
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    modulesList,
    selectedModule,
    setSelectedFormation,
    setSelectedParcours,
    setSelectedModule,
    fetchModules,
    handleImportZip,
    handleImportMbz,
    onRemoveActivity,
    onRemoveCourse,
    onToggleLessonSelection,
    onUpdateCourseTitle,
    onUpdateLessonTitle,
    onUpdateActivityTitle,
    onConfirmImport,
    onConfirmParcoursSelection,
    onGoBack,
  };
}
