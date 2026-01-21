import { useState } from "react";
import JSZip from "jszip";
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import { cleanPath } from "../../../utils/zip-utils";
import Parcours from "../../../utils/interfaces/parcours";
import Tag from "../../../utils/interfaces/tag";

export enum ModulesImportStep {
  ZipImport,
  ImportResult,
}

export type ActivityImportType = Activity & { value?: string };

export type ModuleImportType = Module & {
  courses: (Course & {
    lessons: (Lesson & { activities: ActivityImportType[] })[];
  })[];
};

export default function useImportModules() {
  const [step, setImportStep] = useState<ModulesImportStep>(
    ModulesImportStep.ZipImport,
  );

  const [importedModules, setImportedModules] = useState<ModuleImportType[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string>("");

  const onImportZip = async (file: File) => {
    setError("");
    setIsLoading(true);
    setImportedModules(undefined);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      const foundFiles = loadedZip.file(/export\.json$/);
      const exportFile = foundFiles.find(
        (f) =>
          !f.name.includes("__MACOSX") &&
          !f.name.split("/").pop()?.startsWith("._"),
      );

      if (!exportFile) {
        throw new Error(
          "Fichier export.json introuvable dans l'archive importé.",
        );
      }

      const rootPath = exportFile.name.replace("export.json", "");
      const jsonContent = await exportFile.async("string");
      const flatActivities = JSON.parse(jsonContent);

      const modulesMap = new Map<string, ModuleImportType>();

      for (const item of flatActivities) {
        // --- MODULE ---
        if (!modulesMap.has(item.module)) {
          modulesMap.set(item.module, {
            title: item.module,
            description: "",
            courses: [],
            contacts: [],
            bonusSkills: [],
            tags: [],
            duration: 0,
            parcours: {} as Parcours,
          } as ModuleImportType);
        }
        const currentModule = modulesMap.get(item.module)!;

        // --- COURSE ---
        // On force le typage ici pour éviter que TS pense que c'est "Course | undefined"
        let currentCourse = currentModule.courses.find(
          (c) => c.title === item.course,
        );

        if (!currentCourse) {
          // Création de l'objet
          const newCourse = {
            id: Math.random(),
            title: item.course,
            module: currentModule,
            tags: [],
            contacts: [],
            lessons: [],
            dates: [],
            bonusSkills: [],
            isPublished: false,
          } as Course & { lessons: Lesson[] };

          currentModule.courses.push(newCourse);
          currentCourse = newCourse;
        }

        // --- LESSON ---
        let currentLesson = currentCourse.lessons.find(
          (l) => l.title === item.lesson,
        );

        if (!currentLesson) {
          const newLesson = {
            id: Math.random(),
            title: item.lesson,
            description: "",
            modalite: "hybride",
            tag: {} as Tag,
            adminId: 0,
            course: currentCourse,
            activities: [],
            lessonRating: [],
          } as Lesson;

          currentCourse.lessons.push(newLesson);
          currentLesson = newLesson;
        }

        // --- CONTENT & ACTIVITY ---

        if (item.path) {
          const relativePath = cleanPath(item.path);
          const fullZipPath = rootPath + relativePath;
          const fileInZip = loadedZip.file(fullZipPath);

          const activity: ActivityImportType = {
            id: Math.random(),
            title: item.title,
            type: item.type,
            order: item.order,
            url: item.path,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            value: fileInZip ? await fileInZip.async("string") : "",
            resourceActivities: [],
            resourceBonusActivities: [],
          } as ActivityImportType;

          currentLesson.activities?.push(activity);

          if (!fileInZip) {
            console.warn(`Fichier introuvable: ${fullZipPath}`);
          }
        }
      }

      setImportedModules(Array.from(modulesMap.values()));
    } catch (error) {
      console.error("Erreur import ZIP", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmImport = () => {
    setImportStep(ModulesImportStep.ImportResult);
  };

  return {
    step,
    importedModules,
    isLoading,
    error,
    onImportZip,
    onConfirmImport,
  };
}
