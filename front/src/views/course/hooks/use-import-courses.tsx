import { useState, useEffect, useCallback } from "react";
import JSZip from "jszip";
import { marked } from "marked";
import useHttp from "../../../hooks/use-http";
import { cleanPath } from "../../../utils/zip-utils";

import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import Parcours from "../../../utils/interfaces/parcours";
import Tag from "../../../utils/interfaces/tag";
import Formation from "../../../utils/interfaces/formation";
import Module from "../../../utils/interfaces/module";
import { BASE_URL } from "../../../config/urls";
import { replaceActivityTextContent } from "../../../helpers/replaceActivityTextContent";

export enum CoursesImportStep {
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
  course: string;
  lesson: string;
  order: number;
  path: string;
};

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

const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    // Images
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
    // Documents
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

export default function useImportCourses() {
  const { sendRequest } = useHttp();

  // Navigation Data
  const [step, setImportStep] = useState<CoursesImportStep>(
    CoursesImportStep.ZipImport,
  );
  const [importedCourses, setImportedCourses] = useState<CourseImport[]>();
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
  const [modulesList, setModulesList] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tooltipErrorTip, setTooltipErrorTip] = useState<string>("");

  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");

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
      setError("Une erreur est survenue pendant l'import.");
      setCurrentAction("Erreur critique.");
      setIsLoading(false);
    }
  }, [
    imagesQueue,
    importedCourses,
    selectedModule?.id,
    selectedParcours?.id,
    sendRequest,
    uploadActivityResource,
  ]);

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

          // Injection du MIME type correct dans le constructeur File
          const file = new File([blob], cleanFileName, { type: mimeType });

          const blobUrl = URL.createObjectURL(blob);
          const tempId = `temp-${Date.now()}-${Math.random()}`;

          extractedImages.push({
            file,
            blobUrl,
            size: "medium",
            tempId,
          });

          img.setAttribute("src", blobUrl);
          img.setAttribute("data-temp-id", tempId);
        }
      }
    }

    return {
      newHtml: doc.body.innerHTML,
      newImages: extractedImages,
    };
  };

  const onImportZip = async (file: File) => {
    setError("");
    setTooltipErrorTip("");
    setIsLoading(true);
    setImportedCourses(undefined);
    setImagesQueue([]);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const foundFiles = loadedZip.file(/(export|index)\.json$/);
      const exportFile = foundFiles.find(
        (f) =>
          !f.name.includes("__MACOSX") &&
          !f.name.split("/").pop()?.startsWith("._"),
      );

      if (!exportFile) throw new Error("Fichier d'index introuvable.");

      const fileName = exportFile.name.split("/").pop() || "";
      const rootPath = exportFile.name.replace(fileName, "");
      const jsonContent = await exportFile.async("string");
      const flatActivities: JsonFileFormat[] = JSON.parse(jsonContent);

      const coursesMap = new Map<string, CourseImport>();
      const allExtractedImages: QueuedImage[] = [];

      for (const item of flatActivities) {
        if (!coursesMap.has(item.course)) {
          coursesMap.set(item.course, {
            id: Math.random(),
            title: item.course,
            lessons: [],
            isPublished: false,
            hasError: false,
            contacts: [],
            bonusSkills: [],
            module: {} as Module,
            tags: [],
            dates: [],
            duration: 0,
            parcours: {} as Parcours,
          } as CourseImport);
        }
        const currentCourse = coursesMap.get(item.course)!;

        let currentLesson = currentCourse.lessons.find(
          (l) => l.title === item.lesson,
        ) as Lesson & { hasError?: boolean; isSelected: boolean };

        if (!currentLesson) {
          currentLesson = {
            id: Math.random(),
            title: item.lesson,
            description: "",
            modalite: "hybride",
            tag: {} as Tag,
            adminId: 0,
            course: currentCourse,
            activities: [],
            hasError: false,
            isSelected: true,
            lessonRating: [],
          };
          currentCourse.lessons.push(currentLesson);
        }

        if (item.path) {
          const relativePath = cleanPath(item.path);
          const fullZipPath = rootPath + relativePath;
          const fileInZip = loadedZip.file(fullZipPath);

          const activity: ActivityImport = {
            id: Math.random(),
            title: item.title,
            type: item.type,
            order: item.order,
            url: item.path,
            hasError: false,
          } as ActivityImport;

          if (!fileInZip) {
            setTooltipErrorTip("Fichiers manquants.");
            setError("Un ou plusieurs fichiers sont manquants.");
            activity.hasError = true;
            currentLesson.hasError = true;
            currentCourse.hasError = true;
          } else {
            if (item.type === "text") {
              const markdownContent = await fileInZip.async("string");
              let htmlContent = await marked.parse(markdownContent);
              htmlContent = replaceActivityTextContent(htmlContent);

              console.log({ htmlContent });

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

      setImportedCourses(Array.from(coursesMap.values()));
      setImagesQueue(allExtractedImages);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveCourse = (courseTitle: string) => {
    setImportedCourses(
      (prev) => prev?.filter((c) => c.title !== courseTitle) || undefined,
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
                        activities: l.activities?.map((a) =>
                          a.id === aId ? { ...a, title } : a,
                        ),
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
        .map((c) => ({
          ...c,
          lessons: c.lessons.filter((l) => l.isSelected),
        }))
        .filter((c) => c.lessons.length > 0);
      setImportedCourses(finalCourses as CourseImport[]);
    }
    setImportStep(CoursesImportStep.ImportResult);
  };

  const onGoBack = () => {
    setImportStep((curr) =>
      curr <= CoursesImportStep.ZipImport ? curr : curr - 1,
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
    onImportZip,
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
