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
import { marked } from "marked";

export enum ModulesImportStep {
  ZipImport,
  ParcoursSelection,
  ImportResult,
}

export type ActivityImportType = Activity & {
  value?: string | Blob;
  hasError?: boolean;
};

// AJOUT : Interface pour les images extraites du HTML
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

  // AJOUT : State pour stocker les images extraites
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

  // --- AJOUT : FONCTION DE TRAITEMENT DES IMAGES HTML ---
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

      // Vérifie si l'image est locale (commence par ./files ou files/)
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

          // Remplace le src relatif par l'URL Blob
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

  // --- LOGIQUE ZIP ---
  const onImportZip = async (file: File) => {
    setError("");
    setTooltipErrorTip("");
    setIsLoading(true);
    setImportedModules(undefined);
    setImagesQueue([]); // Reset queue

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const foundFiles = loadedZip.file(/index\.json$/);
      const exportFile = foundFiles.find(
        (f) =>
          !f.name.includes("__MACOSX") &&
          !f.name.split("/").pop()?.startsWith("._"),
      );

      if (!exportFile)
        throw new Error("Fichier index.json introuvable dans l'archive.");

      const rootPath = exportFile.name.replace("index.json", "");
      const jsonContent = await exportFile.async("string");
      const flatActivities: JsonFileFormat[] = JSON.parse(jsonContent);

      const modulesMap = new Map<string, ModuleImportType>();
      const allExtractedImages: QueuedImage[] = []; // Liste temporaire

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
            if (item.type === "text") {
              // Si c'est du texte, on lit la string Markdown
              const markdownContent = await fileInZip.async("string");
              const htmlContent = await marked.parse(markdownContent);

              // --- AJOUT : Traitement des images HTML ---
              const { newHtml, newImages } = await processHtmlImages(
                htmlContent,
                loadedZip,
                rootPath,
              );

              activity.value = newHtml;
              allExtractedImages.push(...newImages);
            } else {
              // Si c'est un fichier binaire (image, pdf...), on garde le blob
              activity.value = await fileInZip.async("blob");
            }
          }
          currentLesson.activities?.push(activity);
        }
      }
      setImportedModules(Array.from(modulesMap.values()));
      setImagesQueue(allExtractedImages); // Sauvegarde des images extraites
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
    imagesQueue, // Exposé si besoin par le composant parent
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
