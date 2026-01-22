import { useState, useEffect } from "react";
import JSZip from "jszip";
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import { cleanPath } from "../../../utils/zip-utils";
import Parcours from "../../../utils/interfaces/parcours";
import Tag from "../../../utils/interfaces/tag";
import Formation from "../../../utils/interfaces/formation";
import useHttp from "../../../hooks/use-http";

export enum ModulesImportStep {
  ZipImport,
  ParcoursSelection,
  ImportResult,
}

export type ActivityImportType = Activity & {
  value?: string | Blob;
  hasError?: boolean;
};

type JsonFileFormat = {
  type: "text" | "file";
  title: string;
  module: string;
  course: string;
  lesson: string;
  order: number;
  path: string;
};

export type ModuleImportType = Module & {
  hasError?: boolean;
  courses: (Course & {
    hasError?: boolean;
    lessons: (Lesson & {
      hasError?: boolean;
      activities: ActivityImportType[];
    })[];
  })[];
};

export default function useImportModules() {
  const { sendRequest } = useHttp();

  const [step, setImportStep] = useState<ModulesImportStep>(
    ModulesImportStep.ZipImport,
  );

  const [importedModules, setImportedModules] = useState<ModuleImportType[]>();

  // États pour la sélection Formation/Parcours
  const [formationsList, setFormationsList] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null,
  );

  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);
  const [selectedParcours, setSelectedParcours] = useState<Parcours | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tooltipErrorTip, setTooltipErrorTip] = useState<string>("");

  // --- LOGIQUE API ---
  useEffect(() => {
    if (step === ModulesImportStep.ParcoursSelection) {
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

  // --- LOGIQUE ZIP ---
  const onImportZip = async (file: File) => {
    setError("");
    setTooltipErrorTip("");
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

      if (!exportFile) throw new Error("Fichier export.json introuvable.");

      const rootPath = exportFile.name.replace("export.json", "");
      const jsonContent = await exportFile.async("string");
      const flatActivities: JsonFileFormat[] = JSON.parse(jsonContent);

      const modulesMap = new Map<string, ModuleImportType>();

      for (const item of flatActivities) {
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

        let currentCourse: (Course & { hasError?: boolean }) | undefined =
          currentModule.courses.find((c) => c.title === item.course);
        if (!currentCourse) {
          currentCourse = {
            id: Math.random(),
            title: item.course,
            module: currentModule,
            lessons: [] as Lesson[],
            isPublished: false,
          } as Course & { lessons: Lesson[] };
          currentModule.courses.push(currentCourse);
        }
        let currentLesson: (Lesson & { hasError?: boolean }) | undefined =
          currentCourse.lessons.find((l) => l.title === item.lesson);

        if (!currentLesson) {
          currentLesson = {
            id: Math.random(),
            title: item.lesson,
            modalite: "hybride",
            tag: {} as Tag,
            adminId: 0,
            course: currentCourse,
            activities: [] as Activity[],
          } as Lesson;
          currentCourse.lessons.push(currentLesson);
        }
        if (item.path) {
          const fullZipPath = rootPath + cleanPath(item.path);
          const fileInZip = loadedZip.file(fullZipPath);

          const activity: ActivityImportType = {
            id: Math.random(),
            title: item.title,
            type: item.type,
            order: item.order,
            url: item.path,
          } as ActivityImportType;

          currentLesson.activities?.push(activity);

          if (!fileInZip) {
            const newError = `Fichier introuvable: ${fullZipPath}`;
            console.warn(newError);
            setTooltipErrorTip(
              "Les fichiers manquant sont indiqués dans la previsualisation en bas.",
            );
            setError("Un ou plusieurs fichiers sont manquants.");

            activity.hasError = true;
            currentLesson.hasError = true;
            currentCourse.hasError = true;
            currentModule.hasError = true;
          } else {
            activity.value = await fileInZip.async(
              item.type === "text" ? "string" : "blob",
            );
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

  /**
   * Supprime un module de la liste des modules importés
   */
  const onRemoveModule = (moduleTitle: string) => {
    setImportedModules((prevModules) => {
      if (!prevModules) return undefined;
      const updatedList = prevModules.filter((m) => m.title !== moduleTitle);
      // Si la liste est vide, on retourne undefined pour reset l'état du UI
      return updatedList.length > 0 ? updatedList : undefined;
    });
  };

  const onConfirmImport = () => {
    setImportStep(ModulesImportStep.ParcoursSelection);
  };

  const onConfirmParcoursSelection = (explicitParcours?: Parcours | null) => {
    if (importedModules) {
      const parcoursToApply =
        explicitParcours !== undefined ? explicitParcours : selectedParcours;

      const updatedModules = importedModules.map((mod) => ({
        ...mod,
        parcours: parcoursToApply ? parcoursToApply : ({} as Parcours),
        parcoursId: parcoursToApply?.id,
      }));

      setImportedModules(updatedModules);
    }
    setImportStep(ModulesImportStep.ImportResult);
  };

  const onGoBack = () => {
    setImportStep((currentStep) => {
      if (currentStep <= ModulesImportStep.ZipImport) return currentStep;
      return currentStep - 1;
    });
  };

  return {
    step,
    importedModules,
    isLoading,
    error,
    tooltipErrorTip,
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    setSelectedParcours,
    setSelectedFormation,
    onImportZip,
    onRemoveModule,
    onConfirmImport,
    onConfirmParcoursSelection,
    onGoBack,
  };
}
