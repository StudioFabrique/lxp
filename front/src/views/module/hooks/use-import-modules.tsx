import { useState } from "react";
import JSZip from "jszip"; // Import de la librairie
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import { cleanPath } from "../../../utils/zip-utils";

export enum ModulesImportStep {
  ZipImport,
  ImportResult,
}

// Type enrichi pour contenir le contenu (HTML string) de l'activité
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

  const onImportZip = async (file: File) => {
    setIsLoading(true);
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // Lire le fichier export.json
      const exportFile = loadedZip.file("export.json");
      if (!exportFile) {
        throw new Error("Fichier export.json manquant");
      }

      const jsonContent = await exportFile.async("string");
      const flatActivities = JSON.parse(jsonContent);

      // Structure temporaire pour regrouper les données
      const modulesMap = new Map<string, ModuleImportType>();

      // Parcourir chaque ligne du JSON pour reconstruire l'arborescence
      for (const item of flatActivities) {
        // --- Gestion du Module ---
        if (!modulesMap.has(item.module)) {
          modulesMap.set(item.module, {
            title: item.module,
            description: "", // Valeur par défaut
            courses: [],
            contacts: [],
            bonusSkills: [],
            tags: [],
            duration: 0,
            parcours: {}, // Mock pour le type
          });
        }
        const currentModule = modulesMap.get(item.module)!;

        // --- Gestion du Cours ---
        let currentCourse = currentModule.courses.find(
          (c) => c.title === item.course,
        );
        if (!currentCourse) {
          currentCourse = {
            id: Math.random(), // ID temporaire pour les keys React
            title: item.course,
            module: currentModule,
            tags: [],
            contacts: [],
            lessons: [],
            dates: [],
            bonusSkills: [],
            isPublished: false,
            course: {},
          } as unknown as Course & { lessons: Lesson[] }; // Cast rapide pour compatibilité
          currentModule.courses.push(currentCourse);
        }

        // --- Gestion de la Leçon ---
        let currentLesson = currentCourse.lessons.find(
          (l) => l.title === item.lesson,
        );
        if (!currentLesson) {
          currentLesson = {
            id: Math.random(),
            title: item.lesson,
            description: "",
            modalite: "elearning",
            tag: {},
            adminId: 0,
            course: currentCourse,
            activities: [],
            lessonRating: [],
          };
          currentCourse.lessons.push(currentLesson);
        }

        // --- Lecture du contenu du fichier dans le ZIP ---
        let content = "";
        if (item.path) {
          const fileInZip = loadedZip.file(cleanPath(item.path));
          if (fileInZip) {
            // Si c'est du texte/html, on lit en string, sinon on pourrait lire en base64/blob
            content = await fileInZip.async("string");
          }
        }

        // --- Création de l'activité ---
        const activity: ActivityImportType = {
          id: Math.random(),
          title: item.title,
          type: item.type,
          order: item.order,
          url: item.path,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          value: content, // On stocke le contenu HTML ici pour Tiptap
        };

        currentLesson?.activities?.push(activity);
      }

      // Conversion de la Map en Array
      setImportedModules(Array.from(modulesMap.values()));
    } catch (error) {
      console.error("Erreur lors de l'import ZIP", error);
      alert("Erreur lors de la lecture du fichier ZIP");
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmImport = () => {
    setImportStep(ModulesImportStep.ImportResult);
  };

  // --- Data Fetching from api ---
  // const retreiveFormations = useCallback(() => {}, []);

  // const retreiveParcours = useCallback(() => {}, []);

  return {
    step,
    importedModules,
    isLoading,
    onImportZip,
    onConfirmImport,
  };
}
