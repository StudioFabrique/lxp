import { useState, useEffect, useCallback, useRef } from "react";

import Course from "../../../../src/utils/interfaces/course";
import Lesson from "../../../../src/utils/interfaces/lesson";
import Parcours from "../../../../src/utils/interfaces/parcours";
import Formation from "../../../../src/utils/interfaces/formation";
import Module from "../../../../src/utils/interfaces/module";
import { BASE_URL } from "../../../config/urls";
import {
  getArchiveFingerprint,
  getMimeType,
  parseCourseZip,
  sanitizeFilename,
} from "../helpers/import-course-helpers";
import { cleanActivityTextContent } from "../../../utils/helpers/text-helpers";
import apiClient from "../../../lib/axios";
import { courseApi } from "../api/course.api";

export enum CoursesImportStep {
  MbzImport,
  CoursesPreview,
  ParcoursSelection,
  ImportResult,
}

import {
  ActivityImport,
  QueuedImage,
} from "../../../utils/interfaces/import-types";

export type CourseImport = Course & {
  id: number;
  sourceFileName?: string;
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

export type ImportProgressStatus =
  | "pending"
  | "processing"
  | "success"
  | "error";

export type ImportProgressItem = {
  id: string;
  title: string;
  context: string;
  filename?: string;
  kind: "course" | "activity";
  status: ImportProgressStatus;
  error?: string;
};

type LessonMapping = { tempId: number; realId: number };

const courseProgressId = (courseId: number) => `course-${courseId}`;
const activityProgressId = (
  courseId: number,
  lessonId: number,
  activityId: number,
) => `activity-${courseId}-${lessonId}-${activityId}`;

export function buildImportProgressItems(courses: CourseImport[]) {
  return courses.flatMap((course): ImportProgressItem[] => [
    {
      id: courseProgressId(course.id),
      title: course.title,
      context: "Structure du cours et de ses leçons",
      kind: "course",
      status: "pending",
    },
    ...course.lessons.flatMap((lesson) =>
      (lesson.activities ?? []).map((activity) => ({
        id: activityProgressId(course.id, lesson.id!, activity.id),
        title: activity.title || "Activité sans titre",
        context: `${course.title} · ${lesson.title}`,
        filename: activity.url?.split("/").pop() || undefined,
        kind: "activity" as const,
        status: "pending" as const,
      })),
    ),
  ]);
}

function getCriticalImportError(error: unknown) {
  const responseMessage = (
    error as { response?: { data?: { message?: string; error?: string } } }
  )?.response?.data;

  return (
    responseMessage?.message ??
    responseMessage?.error ??
    (error instanceof Error ? error.message : undefined) ??
    "Une erreur réseau inconnue est survenue."
  );
}

export default function useImportCourses() {
  // Navigation Data
  const [step, setImportStep] = useState<CoursesImportStep>(
    CoursesImportStep.MbzImport,
  );

  const [importedCourses, setImportedCourses] = useState<CourseImport[]>();
  const imagesQueue = useRef<QueuedImage[]>([]);
  const importedArchiveFingerprints = useRef<Set<string>>(new Set());
  const isMbzImportRunning = useRef(false);

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
  const [importProgressItems, setImportProgressItems] = useState<
    ImportProgressItem[]
  >([]);
  const [criticalImportError, setCriticalImportError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isImportComplete, setIsImportComplete] = useState(false);
  const isImportRunning = useRef(false);
  const importResume = useRef<{
    courseMappings: Map<number, LessonMapping[]>;
    completedItemIds: Set<string>;
  }>({
    courseMappings: new Map(),
    completedItemIds: new Set(),
  });

  /**
   * Envoie le .mbz brut via axiosInstance, supporte l'ajout cumulatif si déjà en mode Preview.
   */
  const handleImportMbz = useCallback(
    async (file: File) => {
      if (isMbzImportRunning.current) return;

      isMbzImportRunning.current = true;
      setError("");
      setTooltipErrorTip("");
      setIsLoading(true);

      try {
        setCurrentAction("Vérification de l'archive Moodle...");
        const archiveFingerprint = await getArchiveFingerprint(file);

        if (importedArchiveFingerprints.current.has(archiveFingerprint)) {
          setError(`L'archive « ${file.name} » a déjà été ajoutée.`);
          setUploadProgress(0);
          return;
        }

        // Détection du mode : si on est déjà sur la vue preview, on ajoute au lieu de réinitialiser
        const isAppending = step === CoursesImportStep.CoursesPreview;

        if (!isAppending) {
          setImportedCourses(undefined);
          imagesQueue.current = [];
        }

        setCurrentAction(
          isAppending
            ? "Téléversement de l'archive Moodle supplémentaire (.mbz) et génération du contenu..."
            : "Téléversement de l'archive Moodle (.mbz) et génération du contenu par l'IA...",
        );

        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post("/course/import-mbz", formData, {
          responseType: "blob",
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            }
          },
        });

        const courseSlug = response.headers["x-course-slug"] || "";

        const zipBlob = response.data;

        setCurrentAction(
          "Package de cours généré. Analyse binaire de la structure...",
        );

        const {
          courses: newCourses,
          images: newImages,
          error: parseError,
          tooltipErrorTip: parseTooltip,
        } = await parseCourseZip(zipBlob, courseSlug);

        const coursesWithSourceFile = newCourses.map((course) => ({
          ...course,
          sourceFileName: file.name,
        }));

        if (parseError) setError(parseError);
        if (parseTooltip) setTooltipErrorTip(parseTooltip);

        if (isAppending) {
          // 1. Cumuler les images dans la queue globale
          imagesQueue.current = [...imagesQueue.current, ...newImages];

          // 2. Fusionner les cours en adaptant les IDs temporaires pour éviter les doublons
          setImportedCourses((prev) => {
            const existing = prev || [];

            // Recherche des ID maximaux déjà utilisés
            let maxCourseId = Math.max(0, ...existing.map((c) => c.id));
            let maxLessonId = Math.max(
              0,
              ...existing.flatMap((c) => c.lessons.map((l) => l.id as number)),
            );
            let maxActivityId = Math.max(
              0,
              ...existing.flatMap((c) =>
                c.lessons.flatMap((l) => l.activities?.map((a) => a.id) || []),
              ),
            );

            // Remappage séquentiel des nouveaux cours
            const adjustedNewCourses = coursesWithSourceFile.map((course) => {
              maxCourseId++;
              const currentCourseId = maxCourseId;

              const adjustedLessons = course.lessons.map((lesson: Lesson) => {
                maxLessonId++;
                const currentLessonId = maxLessonId;

                const adjustedActivities =
                  lesson.activities?.map((activity) => {
                    maxActivityId++;
                    return { ...activity, id: maxActivityId };
                  }) || [];

                return {
                  ...lesson,
                  id: currentLessonId,
                  activities: adjustedActivities,
                };
              });

              return {
                ...course,
                id: currentCourseId,
                lessons: adjustedLessons,
              };
            }) as CourseImport[];

            return [...existing, ...adjustedNewCourses];
          });
        } else {
          // Premier import classique
          setImportedCourses(coursesWithSourceFile);
          imagesQueue.current = newImages;
          setImportStep(CoursesImportStep.CoursesPreview);
        }

        importedArchiveFingerprints.current.add(archiveFingerprint);
      } catch (err: unknown) {
        console.error(`Erreur import mbz:`, err);
        const importError = err as {
          response?: { data?: Blob | { message?: string } };
          message?: string;
        };
        let errorMessage =
          "Une erreur est survenue lors de l'intégration de votre cours.";

        if (importError.response?.data instanceof Blob) {
          try {
            const textError = await importError.response.data.text();
            const jsonError = JSON.parse(textError);
            if (jsonError.error) {
              errorMessage = jsonError.error;
              if (jsonError.details) {
                try {
                  const subJson = JSON.parse(
                    jsonError.details.replace("Erreur API IA (/ingest): ", ""),
                  );
                  if (subJson.detail) errorMessage += ` (${subJson.detail})`;
                  else errorMessage += ` (${jsonError.details})`;
                } catch {
                  errorMessage += ` (${jsonError.details})`;
                }
              }
            }
          } catch (blobParseError) {
            console.error(`Erreur parsing blob error:`, blobParseError);
          }
        } else if (
          importError.response?.data &&
          !(importError.response.data instanceof Blob) &&
          importError.response.data.message
        ) {
          errorMessage = importError.response.data.message;
        } else if (importError.message) {
          errorMessage = importError.message;
        }

        setError(errorMessage);
        setUploadProgress(0);
      } finally {
        isMbzImportRunning.current = false;
        setIsLoading(false);
      }
    },
    [step],
  );

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

        await courseApi.mutations.uploadActivityResource(lessonId, formData);
      } catch (e) {
        console.error(`Erreur upload ressource:`, e);
        throw e;
      }
    },
    [],
  );

  /**
   * PROCESSUS DE PERSISTANCE DES STRUCURES ET MÉDIAS SUR LE SERVEUR DE DONNÉES SQL
   */
  const processImport = useCallback(
    async (coursesOverride?: CourseImport[]) => {
      const coursesToImport = coursesOverride ?? importedCourses;
      if (!coursesToImport?.length || isImportRunning.current) return;

      isImportRunning.current = true;
      setIsImporting(true);
      setIsImportComplete(false);
      setCriticalImportError("");
      setImportProgressItems((current) =>
        current.map((item) =>
          item.status === "error"
            ? { ...item, status: "pending", error: undefined }
            : item,
        ),
      );

      const totalItems = buildImportProgressItems(coursesToImport).length;
      let activeItemId: string | null = null;
      let activeItemTitle = "";

      const updateItem = (
        itemId: string,
        status: ImportProgressStatus,
        itemError?: string,
      ) => {
        setImportProgressItems((current) =>
          current.map((item) =>
            item.id === itemId ? { ...item, status, error: itemError } : item,
          ),
        );
      };

      const markItemAsSuccessful = (itemId: string) => {
        importResume.current.completedItemIds.add(itemId);
        updateItem(itemId, "success");
        setUploadProgress(
          (importResume.current.completedItemIds.size / totalItems) * 100,
        );
      };

      try {
        for (const course of coursesToImport) {
          const courseItemId = courseProgressId(course.id);
          let lessonsMap = importResume.current.courseMappings.get(course.id);

          if (!lessonsMap) {
            activeItemId = courseItemId;
            activeItemTitle = course.title;
            updateItem(courseItemId, "processing");
            setCurrentAction(`Création du cours : ${course.title}`);
            await new Promise((resolve) => setTimeout(resolve, 50));

            const structurePayload = {
              title: course.title,
              description: course.description,
              courseSlug: course.courseSlug,
              moduleId: selectedModule?.id,
              parcoursId: selectedParcours?.id,
              lessons: course.lessons.map((lesson) => ({
                id: lesson.id!,
                title: lesson.title,
                modalite: lesson.modalite,
                isSelected: true,
              })),
            };

            const structureResponse =
              await courseApi.mutations.importStructure(structurePayload);
            lessonsMap = structureResponse.lessonsMap;
            importResume.current.courseMappings.set(course.id, lessonsMap);
            markItemAsSuccessful(courseItemId);
          }

          for (const lesson of course.lessons) {
            const mapping = lessonsMap.find(
              (candidate) => candidate.tempId === lesson.id,
            );
            if (!mapping) {
              activeItemId = courseItemId;
              activeItemTitle = lesson.title;
              throw new Error(
                `La leçon « ${lesson.title} » n'a pas pu être associée au cours créé.`,
              );
            }
            const realLessonId = mapping.realId;

            for (const activity of lesson.activities) {
              const activityItemId = activityProgressId(
                course.id,
                lesson.id,
                activity.id,
              );
              if (importResume.current.completedItemIds.has(activityItemId)) {
                continue;
              }

              activeItemId = activityItemId;
              activeItemTitle = activity.title || "Activité sans titre";
              updateItem(activityItemId, "processing");
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

                      const response =
                        await courseApi.mutations.uploadBlogImage(formData);

                      const serverUrl = response.response || response.url;
                      const fullUrl = serverUrl.startsWith("http")
                        ? serverUrl
                        : `${BASE_URL}${serverUrl}`;

                      finalHtml = finalHtml.split(img.blobUrl).join(fullUrl);
                      finalHtml = cleanActivityTextContent(finalHtml);
                    } catch (err) {
                      console.error("Erreur upload image blog", err);
                    }
                  }
                }

                await courseApi.mutations.createTextActivity(realLessonId, {
                  title: activity.title ?? "",
                  description: "",
                  value: finalHtml,
                  parent: "lesson",
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

              markItemAsSuccessful(activityItemId);
            }
          }
        }

        setCurrentAction("Importation terminée avec succès !");
        setUploadProgress(100);
        setIsImportComplete(true);
        setIsImporting(false);
      } catch (globalError) {
        console.error(globalError);
        const technicalMessage = getCriticalImportError(globalError);
        const criticalMessage = activeItemTitle
          ? `Échec de « ${activeItemTitle} » : ${technicalMessage}`
          : `Une erreur critique est survenue : ${technicalMessage}`;
        if (activeItemId) {
          updateItem(activeItemId, "error", technicalMessage);
        }
        setCriticalImportError(criticalMessage);

        setIsImporting(false);
      } finally {
        isImportRunning.current = false;
      }
    },
    [importedCourses, selectedModule, selectedParcours, uploadActivityResource],
  );

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
    let finalCourses: CourseImport[] = [];
    if (importedCourses) {
      finalCourses = importedCourses
        .map((c) => ({ ...c, lessons: c.lessons.filter((l) => l.isSelected) }))
        .filter((c) => c.lessons.length > 0) as CourseImport[];
      setImportedCourses(finalCourses);
    }
    importResume.current = {
      courseMappings: new Map(),
      completedItemIds: new Set(),
    };
    setImportProgressItems(buildImportProgressItems(finalCourses));
    setCriticalImportError("");
    setIsImportComplete(false);
    setUploadProgress(0);
    setImportStep(CoursesImportStep.ImportResult);
    void processImport(finalCourses);
  };

  const onRetryImport = useCallback(() => {
    void processImport();
  }, [processImport]);

  const onGoBack = () => {
    setImportStep((curr) =>
      curr <= CoursesImportStep.CoursesPreview ? curr : curr - 1,
    );
  };

  const loadModules = useCallback(async (parcours: Parcours | null) => {
    setModulesList([]);
    setSelectedModule(null);
    if (!parcours) return;

    try {
      const res = await apiClient.get(`/modules/${parcours.id}`);
      setModulesList(res.data.modules);
    } catch (err) {
      console.error("Erreur chargement modules:", err);
    }
  }, []);

  const handleSelectFormation = useCallback(async (formation: Formation) => {
    setSelectedFormation(formation);
    setParcoursList([]);
    setSelectedParcours(null);
    setModulesList([]);
    setSelectedModule(null);

    try {
      const res = await apiClient.get(
        `/parcours/parcours-by-formation/${formation.id}`,
      );
      setParcoursList(res.data.data);
    } catch (err) {
      console.error("Erreur chargement parcours:", err);
    }
  }, []);

  const handleSelectParcours = useCallback(
    (parcours: Parcours | null) => {
      setSelectedParcours(parcours);
      void loadModules(parcours);
    },
    [loadModules],
  );

  const fetchModules = useCallback(async () => {
    await loadModules(selectedParcours);
  }, [loadModules, selectedParcours]);

  // --- Effects de Synchronisation & Chargement des Données de Listes ---

  useEffect(() => {
    if (step === CoursesImportStep.ParcoursSelection) {
      apiClient.get("/formation").then((res) => setFormationsList(res.data));
    }
  }, [step]);

  return {
    step,
    importedCourses,
    isLoading,
    error,
    tooltipErrorTip,
    uploadProgress,
    currentAction,
    importProgressItems,
    criticalImportError,
    isImporting,
    isImportComplete,
    imagesQueue,
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    modulesList,
    selectedModule,
    setSelectedFormation: handleSelectFormation,
    setSelectedParcours: handleSelectParcours,
    setSelectedModule,
    fetchModules,
    handleImportMbz,
    onRemoveActivity,
    onRemoveCourse,
    onToggleLessonSelection,
    onUpdateCourseTitle,
    onUpdateLessonTitle,
    onUpdateActivityTitle,
    onConfirmImport,
    onConfirmParcoursSelection,
    onRetryImport,
    onGoBack,
  };
}
