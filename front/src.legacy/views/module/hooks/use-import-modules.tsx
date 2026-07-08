import { useState, useEffect, useCallback } from "react";
import JSZip from "jszip";
import { marked } from "marked";
import useHttp from "../../../hooks/use-http";
import { cleanPath } from "../../../utils/zip-utils";

import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import Parcours from "../../../utils/interfaces/parcours";
import Tag from "../../../utils/interfaces/tag";
import Formation from "../../../utils/interfaces/formation";
import { BASE_URL } from "../../../config/urls";
import { replaceActivityTextContent } from "../../../helpers/cleanActivityTextContent";

export enum ModulesImportStep {
  ZipImport,
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

type JsonFileFormat = {
  type: "text" | "file";
  title: string;
  module: string;
  course: string;
  lesson: string;
  order: number;
  path: string;
};

export type ModuleImport = Module & {
  hasError?: boolean;
  courses: (Course & {
    id: number; // Temporaire ID pour le front
    hasError?: boolean;
    lessons: (Lesson & {
      id: number; // Temporaire ID pour le front
      hasError?: boolean;
      activities: ActivityImport[];
    })[];
  })[];
};

// --- UTILS ---

const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "bmp":
      return "image/bmp";
    case "pdf":
      return "application/pdf";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "txt":
      return "text/plain";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "md":
      return "text/markdown";
    default:
      return "application/octet-stream";
  }
};

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
};

export default function useImportModules() {
  const { sendRequest, error: apiRequestError } = useHttp();

  const [step, setImportStep] = useState<ModulesImportStep>(
    ModulesImportStep.ZipImport,
  );
  const [importedModules, setImportedModules] = useState<ModuleImport[]>();
  const [imagesQueue, setImagesQueue] = useState<QueuedImage[]>([]);

  // Selection Data
  const [formationsList, setFormationsList] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null,
  );
  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);
  const [selectedParcours, setSelectedParcours] = useState<Parcours | null>(
    null,
  );

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tooltipErrorTip, setTooltipErrorTip] = useState<string>("");

  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");

  // --- API HELPERS ---

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

  // --- PROCESS MAIN ---

  const processImport = useCallback(async () => {
    if (!importedModules) return;

    if (!selectedFormation) {
      setError("Une formation doit être sélectionnée.");
      return;
    }

    let processedCount = 0;
    let totalItems = 0;

    importedModules.forEach((m) => {
      totalItems++;
      m.courses.forEach((c) => {
        totalItems++;
        c.lessons.forEach((l) => {
          if (l.activities) totalItems += l.activities.length;
        });
      });
    });

    try {
      for (const module of importedModules) {
        setCurrentAction(`Création du module : ${module.title}`);
        await new Promise((r) => setTimeout(r, 50));

        // 1. Création du Module
        // IMPORTANT : Le backend attend "module" comme clé racine dans le JSON stringifié
        const modulePayload = {
          title: module.title,
          description: module.description || "",
          duration:
            module.duration && module.duration > 0 ? module.duration : 1,
          formationId: selectedFormation.id,
          parcoursId: selectedParcours?.id,
          contacts: [],
          skills: [],
        };

        const formData = new FormData();
        // Le middleware jsonParser fait : JSON.parse(req.body.module)
        // Donc on envoie l'objet stringifié dans la clé 'module'
        formData.append("module", JSON.stringify(modulePayload));

        // Note: Pas d'image pour l'instant

        console.log("Envoi Module:", modulePayload);

        const apiResponse = await sendRequest({
          path: "/formation/new-module",
          method: "post",
          body: formData,
        });

        const responseData = apiResponse?.data || apiResponse;

        const createdModuleId = responseData?.id;

        if (!createdModuleId) {
          throw new Error(
            "Un problème est survenu lors de la création du module",
          );
        }

        processedCount++;
        setUploadProgress((processedCount / totalItems) * 100);

        // 2. Traitement des Cours
        for (const course of module.courses) {
          setCurrentAction(`Création du cours : ${course.title}`);
          await new Promise((r) => setTimeout(r, 50));

          const structurePayload = {
            title: course.title,
            description: course.description,
            moduleId: createdModuleId,
            parcoursId: selectedParcours?.id,
            lessons: course.lessons.map((l) => ({
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

          // Sécurité sur la réponse structure
          if (!structureResponse) {
            throw new Error(
              "Erreur lors de la création de la structure du cours.",
            );
          }

          processedCount++;
          setUploadProgress((processedCount / totalItems) * 100);

          const {
            lessonsMap,
          }: { lessonsMap: { tempId: number; realId: number }[] } =
            structureResponse;

          // 3. Traitement des Leçons
          for (const lesson of course.lessons) {
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
                const imagesToProcess = imagesQueue.filter((img) =>
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
                      console.error("Erreur upload image", err);
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
      }

      setCurrentAction("Importation terminée avec succès !");
      setUploadProgress(100);
    } catch (globalError) {
      console.error(globalError);
      const message =
        (globalError as Error).message ||
        "Une erreur est survenue pendant l'import.";
      setError(message);
      setIsLoading(false);
    }
  }, [
    importedModules,
    selectedFormation,
    selectedParcours?.id,
    imagesQueue,
    sendRequest,
    uploadActivityResource,
  ]);

  // --- ZIP & IMAGES PROCESSING ---

  const processHtmlImages = async (
    htmlContent: string,
    zip: JSZip,
    rootPath: string,
  ): Promise<{ newHtml: string; newImages: QueuedImage[] }> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgTags = doc.querySelectorAll("img");
    const extractedImages: QueuedImage[] = [];

    for (const img of Array.from(imgTags)) {
      const src = img.getAttribute("src");
      if (src && (src.startsWith("./files") || src.startsWith("files/"))) {
        const cleanSrc = cleanPath(src);
        const fullPath = rootPath + cleanSrc;
        const fileInZip = zip.file(fullPath);

        if (fileInZip) {
          const blob = await fileInZip.async("blob");
          const rawName = cleanSrc.split("/").pop() || "image.png";
          const cleanFileName = sanitizeFilename(rawName);
          const mimeType = getMimeType(cleanFileName);

          const file = new File([blob], cleanFileName, { type: mimeType });
          const blobUrl = URL.createObjectURL(blob);
          const tempId = `temp-${Date.now()}-${Math.random()}`;

          extractedImages.push({ file, blobUrl, size: "medium", tempId });

          img.setAttribute("src", blobUrl);
          img.setAttribute("data-temp-id", tempId);
        }
      }
    }
    return { newHtml: doc.body.innerHTML, newImages: extractedImages };
  };

  const onImportZip = async (file: File) => {
    setError("");
    setTooltipErrorTip("");
    setIsLoading(true);
    setImportedModules(undefined);
    setImagesQueue([]);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const foundFiles = loadedZip.file(/index\.json$/);
      const exportFile = foundFiles.find(
        (f) =>
          !f.name.includes("__MACOSX") &&
          !f.name.split("/").pop()?.startsWith("._"),
      );

      if (!exportFile) throw new Error("Fichier index.json introuvable.");

      const rootPath = exportFile.name.replace("index.json", "");
      const jsonContent = await exportFile.async("string");
      const flatActivities: JsonFileFormat[] = JSON.parse(jsonContent);

      const modulesMap = new Map<string, ModuleImport>();
      const allExtractedImages: QueuedImage[] = [];

      for (const item of flatActivities) {
        if (!modulesMap.has(item.module)) {
          modulesMap.set(item.module, {
            id: Math.random(),
            title: item.module,
            description: "",
            courses: [],
            contacts: [],
            bonusSkills: [],
            duration: 1,
            tags: [],
            parcours: {} as Parcours,
          } as ModuleImport);
        }
        const currentModule = modulesMap.get(item.module)!;

        let currentCourse = currentModule.courses.find(
          (c) => c.title === item.course,
        );
        if (!currentCourse) {
          currentCourse = {
            id: Math.random(),
            title: item.course,
            module: currentModule,
            lessons: [],
            isPublished: false,
          } as unknown as Course & { id: number; lessons: Lesson[] };
          currentModule.courses.push(currentCourse);
        }

        let currentLesson = currentCourse.lessons.find(
          (l) => l.title === item.lesson,
        );
        if (!currentLesson) {
          currentLesson = {
            id: Math.random(),
            title: item.lesson,
            modalite: "hybride",
            tag: {} as Tag,
            adminId: 0,
            course: currentCourse,
            activities: [],
          } as unknown as Lesson;
          currentCourse.lessons.push(currentLesson);
        }

        if (item.path) {
          const fullZipPath = rootPath + cleanPath(item.path);
          const fileInZip = loadedZip.file(fullZipPath);
          const activity: ActivityImport = {
            id: Math.random(),
            title: item.title,
            type: item.type,
            order: item.order,
            url: item.path,
          } as ActivityImport;

          if (!fileInZip) {
            setTooltipErrorTip("Fichiers manquants.");
            setError("Un ou plusieurs fichiers sont manquants.");
            activity.hasError = true;
          } else {
            if (item.type === "text") {
              const markdownContent = await fileInZip.async("string");
              let htmlContent = await marked.parse(markdownContent);
              htmlContent = replaceActivityTextContent(htmlContent);
              const { newHtml, newImages } = await processHtmlImages(
                htmlContent,
                loadedZip,
                rootPath,
              );
              activity.value = newHtml;
              allExtractedImages.push(...newImages);
            } else {
              activity.value = await fileInZip.async("blob");
            }
          }
          currentLesson.activities?.push(activity);
        }
      }
      setImportedModules(Array.from(modulesMap.values()));
      setImagesQueue(allExtractedImages);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveModule = (moduleTitle: string) => {
    setImportedModules(
      (prev) => prev?.filter((m) => m.title !== moduleTitle) || undefined,
    );
  };

  const onUpdateModuleTitle = (moduleId: number, newTitle: string) => {
    setImportedModules((prev) =>
      prev?.map((m) => (m.id === moduleId ? { ...m, title: newTitle } : m)),
    );
  };

  const onUpdateCourseTitle = (
    moduleId: number,
    courseId: number,
    newTitle: string,
  ) => {
    setImportedModules(
      (prev) =>
        prev?.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                courses: m.courses.map((c) =>
                  c.id === courseId ? { ...c, title: newTitle } : c,
                ),
              }
            : m,
        ) as ModuleImport[],
    );
  };

  const onUpdateLessonTitle = (
    moduleId: number,
    courseId: number,
    lessonId: number,
    newTitle: string,
  ) => {
    setImportedModules(
      (prev) =>
        prev?.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                courses: m.courses.map((c) =>
                  c.id === courseId
                    ? {
                        ...c,
                        lessons: c.lessons.map((l) =>
                          l.id === lessonId ? { ...l, title: newTitle } : l,
                        ),
                      }
                    : c,
                ),
              }
            : m,
        ) as ModuleImport[],
    );
  };

  const onUpdateActivityTitle = (
    moduleId: number,
    courseId: number,
    lessonId: number,
    activityId: number,
    newTitle: string,
  ) => {
    setImportedModules(
      (prev) =>
        prev?.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                courses: m.courses.map((c) =>
                  c.id === courseId
                    ? {
                        ...c,
                        lessons: c.lessons.map((l) =>
                          l.id === lessonId
                            ? {
                                ...l,
                                activities: l.activities?.map((a) =>
                                  a.id === activityId
                                    ? { ...a, title: newTitle }
                                    : a,
                                ),
                              }
                            : l,
                        ),
                      }
                    : c,
                ),
              }
            : m,
        ) as ModuleImport[],
    );
  };

  const onConfirmImport = () =>
    setImportStep(ModulesImportStep.ParcoursSelection);

  const onConfirmParcoursSelection = () => {
    setImportStep(ModulesImportStep.ImportResult);
  };

  const onGoBack = () => {
    setImportStep((curr) =>
      curr <= ModulesImportStep.ZipImport ? curr : curr - 1,
    );
  };

  useEffect(() => {
    if (step === ModulesImportStep.ImportResult && importedModules) {
      processImport();
    }
  }, [importedModules, processImport, step]);

  useEffect(() => {
    if (step === ModulesImportStep.ParcoursSelection) {
      sendRequest({ path: "/formation" }, (data) => setFormationsList(data));
    }
  }, [step, sendRequest]);

  useEffect(() => {
    if (selectedFormation) {
      setParcoursList([]);
      setSelectedParcours(null);
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${selectedFormation.id}`,
          method: "get",
        },
        (data) => setParcoursList(data.data),
      );
    }
  }, [selectedFormation, sendRequest]);

  // Vérification apiRequestError avec le message d'erreur conernant les modules
  useEffect(() => {
    if (!apiRequestError) return;
    const errorMessage =
      apiRequestError === "MODULE_ALREADY_EXISTS"
        ? "Le module est déjà existant"
        : "Un problème est survenu";

    setError(errorMessage);
  }, [apiRequestError]);

  return {
    step,
    importedModules,
    isLoading,
    error,
    tooltipErrorTip,
    uploadProgress,
    currentAction,
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    setSelectedFormation,
    setSelectedParcours,
    onImportZip,
    onRemoveModule,
    onUpdateModuleTitle,
    onUpdateCourseTitle,
    onUpdateLessonTitle,
    onUpdateActivityTitle,
    onConfirmImport,
    onConfirmParcoursSelection,
    onGoBack,
  };
}
