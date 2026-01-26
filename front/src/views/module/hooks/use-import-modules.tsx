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
import { marked } from "marked"; // Assurez-vous d'avoir npm install marked

export enum ModulesImportStep {
  ZipImport,
  ParcoursSelection,
  ImportResult,
}

export type ActivityImportType = Activity & {
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
  const [imagesQueue, setImagesQueue] = useState<QueuedImage[]>([]);

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

  // --- FONCTION UTILITAIRE : Traitement HTML & Images ---
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

      // Vérifie si l'image pointe vers le dossier files (relatif ou absolu dans le zip)
      if (src && (src.startsWith("./files") || src.startsWith("files/"))) {
        const cleanSrc = cleanPath(src);
        const fullPath = rootPath + cleanSrc;
        const fileInZip = zip.file(fullPath);

        if (fileInZip) {
          // Conversion Blob
          const blob = await fileInZip.async("blob");
          const fileName = cleanSrc.split("/").pop() || "image.png";
          const file = new File([blob], fileName, { type: blob.type });
          const blobUrl = URL.createObjectURL(blob);
          const tempId = `temp-${Date.now()}-${Math.random()}`;

          // Ajout à la file d'attente
          extractedImages.push({
            file,
            blobUrl,
            size: "medium",
            tempId,
          });

          // Remplacement dans le HTML pour Tiptap
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

  // --- LOGIQUE IMPORT ZIP ---
  const onImportZip = async (file: File) => {
    setError("");
    setTooltipErrorTip("");
    setIsLoading(true);
    setImportedModules(undefined);
    setImagesQueue([]);

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // Recherche export.json ou index.json (support des deux noms au cas où)
      const foundFiles = loadedZip.file(/(export|index)\.json$/);
      const exportFile = foundFiles.find(
        (f) =>
          !f.name.includes("__MACOSX") &&
          !f.name.split("/").pop()?.startsWith("._"),
      );

      if (!exportFile)
        throw new Error("Fichier d'index (export.json) introuvable.");

      // Définition de la racine (si le json est dans un sous-dossier)
      // Ex: "mondossier/export.json" -> rootPath = "mondossier/"
      const fileName = exportFile.name.split("/").pop() || "";
      const rootPath = exportFile.name.replace(fileName, "");

      const jsonContent = await exportFile.async("string");
      const flatActivities: JsonFileFormat[] = JSON.parse(jsonContent);

      const modulesMap = new Map<string, ModuleImportType>();
      const allExtractedImages: QueuedImage[] = [];

      for (const item of flatActivities) {
        // 1. Initialisation Module
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
            hasError: false,
          } as ModuleImportType);
        }
        const currentModule = modulesMap.get(item.module)!;

        // 2. Initialisation Course
        let currentCourse = currentModule.courses.find(
          (c) => c.title === item.course,
        ) as Course & { hasError?: boolean };
        if (!currentCourse) {
          currentCourse = {
            id: Math.random(),
            title: item.course,
            module: currentModule,
            lessons: [] as (Lesson & { hasError?: boolean })[],
            isPublished: false,
            hasError: false,
          } as Course & { lessons: Lesson[]; hasError?: boolean };
          currentModule.courses.push(currentCourse);
        }

        // 3. Initialisation Lesson
        let currentLesson = currentCourse.lessons.find(
          (l) => l.title === item.lesson,
        ) as Lesson & { hasError?: boolean };
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
          } as Lesson & { hasError?: boolean };
          currentCourse.lessons.push(currentLesson);
        }

        // 4. Traitement Activité
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
            hasError: false,
          } as ActivityImportType;

          if (!fileInZip) {
            // ERREUR : Fichier manquant
            const newError = `Fichier introuvable: ${fullZipPath}`;
            console.warn(newError);
            setTooltipErrorTip(
              "Fichiers manquants indiqués dans la prévisualisation.",
            );
            setError("Un ou plusieurs fichiers sont manquants.");

            activity.hasError = true;
            currentLesson.hasError = true;
            currentCourse.hasError = true;
            currentModule.hasError = true;
          } else {
            // SUCCÈS : Fichier trouvé
            if (item.type === "text") {
              // A. Lecture Markdown
              const markdownContent = await fileInZip.async("string");

              // B. Conversion Markdown -> HTML
              // Note: marked retourne une Promise si async est activé, ou string sinon.
              // On await par sécurité.
              const htmlContent = await marked.parse(markdownContent);

              // C. Extraction et remplacement des images
              const { newHtml, newImages } = await processHtmlImages(
                htmlContent,
                loadedZip,
                rootPath,
              );

              activity.value = newHtml;
              allExtractedImages.push(...newImages);
            } else {
              // D. Fichier binaire (PDF, etc.)
              activity.value = await fileInZip.async("blob");
            }
          }

          // AJOUT UNIQUE (Correction du doublon)
          currentLesson.activities?.push(activity);
        }
      }

      setImportedModules(Array.from(modulesMap.values()));
      setImagesQueue(allExtractedImages);
    } catch (error) {
      console.error("Erreur import ZIP", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ACTIONS ---
  const onRemoveModule = (moduleTitle: string) => {
    setImportedModules((prevModules) => {
      if (!prevModules) return undefined;
      const updatedList = prevModules.filter((m) => m.title !== moduleTitle);
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
    imagesQueue,
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
