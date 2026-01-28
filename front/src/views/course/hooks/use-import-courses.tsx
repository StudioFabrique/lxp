import { useState, useEffect } from "react";
import JSZip from "jszip";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import { cleanPath } from "../../../utils/zip-utils";
import Parcours from "../../../utils/interfaces/parcours";
import Tag from "../../../utils/interfaces/tag";
import Formation from "../../../utils/interfaces/formation";
import useHttp from "../../../hooks/use-http";
import { marked } from "marked";
import Module from "../../../utils/interfaces/module";

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

export default function useImportCourses() {
  const { sendRequest } = useHttp();

  const [step, setImportStep] = useState<CoursesImportStep>(
    CoursesImportStep.ZipImport,
  );

  const [importedCourses, setImportedCourses] = useState<CourseImport[]>();
  const [imagesQueue, setImagesQueue] = useState<QueuedImage[]>([]);

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tooltipErrorTip, setTooltipErrorTip] = useState<string>("");

  useEffect(() => {
    if (step === CoursesImportStep.ParcoursSelection) {
      const processData = (data: Formation[]) => {
        setFormationsList(data);
      };
      sendRequest({ path: "/formation" }, processData);
    }
  }, [step, sendRequest]);

  useEffect(() => {
    if (selectedFormation) {
      setParcoursList([]);
      setSelectedParcours(null);
      setModulesList([]);
      setSelectedModule(null);
      const processData = (data: { data: Parcours[] }) => {
        setParcoursList(data.data);
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${selectedFormation.id}`,
          method: "get",
        },
        processData,
      );
    }
  }, [selectedFormation, sendRequest]);

  useEffect(() => {
    if (selectedParcours) {
      setModulesList([]);
      setSelectedModule(null);
      const processData = (data: { modules: Module[] }) => {
        setModulesList(data.modules);
      };
      sendRequest(
        {
          path: `/modules/${selectedParcours.id}`,
          method: "get",
        },
        processData,
      );
    } else {
      setModulesList([]);
      setSelectedModule(null);
    }
  }, [selectedParcours, sendRequest]);

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
          const fileName = cleanSrc.split("/").pop() || "image.png";
          const file = new File([blob], fileName, { type: blob.type });
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
        } else {
          console.warn(`Image introuvable dans le ZIP : ${fullPath}`);
          img.style.border = "2px solid red";
          img.setAttribute("title", "Image manquante");
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

      if (!exportFile)
        throw new Error("Fichier d'index (index.json) introuvable.");

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
            modalite: "hybride",
            tag: {} as Tag,
            adminId: 0,
            course: currentCourse,
            activities: [] as Activity[],
            hasError: false,
            isSelected: true,
          } as Lesson & { hasError?: boolean; isSelected: boolean };
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
            const newError = `Fichier introuvable: ${fullZipPath}`;
            console.warn(newError);
            setTooltipErrorTip(
              "Fichiers manquants indiqués dans la prévisualisation.",
            );
            setError("Un ou plusieurs fichiers sont manquants.");

            activity.hasError = true;
            currentLesson.hasError = true;
            currentCourse.hasError = true;
          } else {
            if (item.type === "text") {
              const markdownContent = await fileInZip.async("string");
              const htmlContent = await marked.parse(markdownContent);
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
      console.error("Erreur import ZIP", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveCourse = (courseTitle: string) => {
    setImportedCourses((prevCourses) => {
      if (!prevCourses) return undefined;
      const updatedList = prevCourses.filter((c) => c.title !== courseTitle);
      return updatedList.length > 0 ? updatedList : undefined;
    });
  };

  const onToggleLessonSelection = (courseId: number, lessonId: number) => {
    setImportedCourses((prev) => {
      if (!prev) return undefined;
      return prev.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          lessons: course.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            return { ...lesson, isSelected: !lesson.isSelected };
          }),
        };
      }) as CourseImport[];
    });
  };

  const onUpdateCourseTitle = (courseId: number, newTitle: string) => {
    setImportedCourses((prev) => {
      if (!prev) return undefined;
      return prev.map((c) =>
        c.id === courseId ? { ...c, title: newTitle } : c,
      );
    });
  };

  const onUpdateLessonTitle = (
    courseId: number,
    lessonId: number,
    newTitle: string,
  ) => {
    setImportedCourses((prev) => {
      if (!prev) return undefined;
      return prev.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          lessons: course.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson,
          ),
        };
      }) as CourseImport[];
    });
  };

  const onUpdateActivityTitle = (
    courseId: number,
    lessonId: number,
    activityId: number,
    newTitle: string,
  ) => {
    setImportedCourses((prev) => {
      if (!prev) return undefined;
      return prev.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          lessons: course.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            return {
              ...lesson,
              activities: (lesson.activities || []).map((act) =>
                act.id === activityId ? { ...act, title: newTitle } : act,
              ),
            };
          }),
        };
      }) as CourseImport[];
    });
  };

  const onConfirmImport = () => {
    setImportStep(CoursesImportStep.ParcoursSelection);
  };

  const onConfirmParcoursSelection = (explicitParcours?: Parcours | null) => {
    if (importedCourses) {
      const parcoursToApply =
        explicitParcours !== undefined ? explicitParcours : selectedParcours;

      const moduleToApply = selectedModule;

      const updatedCourses = importedCourses.map((crs) => {
        const updatedCourse: CourseImport = {
          ...crs,
          lessons: crs.lessons.filter(
            (l) => l.isSelected,
          ) as CourseImport["lessons"],

          parcours: parcoursToApply
            ? parcoursToApply
            : ({} as CourseImport["parcours"]),
          parcoursId: parcoursToApply?.id,
          module: moduleToApply ? moduleToApply : ({} as Module),
          moduleId: moduleToApply?.id,
        };
        return updatedCourse;
      });

      const finalCourses = updatedCourses.filter(
        (c) => c.lessons.length > 0 || c.id,
      );

      setImportedCourses(finalCourses);
    }
    setImportStep(CoursesImportStep.ImportResult);
  };

  const onGoBack = () => {
    setImportStep((currentStep) => {
      if (currentStep <= CoursesImportStep.ZipImport) return currentStep;
      return currentStep - 1;
    });
  };

  return {
    step,
    importedCourses,
    isLoading,
    error,
    tooltipErrorTip,
    imagesQueue,
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    modulesList,
    selectedModule,
    setSelectedParcours,
    setSelectedFormation,
    setSelectedModule,
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
