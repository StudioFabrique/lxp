import JSZip from "jszip";
import { ActivityImport, QueuedImage } from "../../../utils/interfaces/import-types";
import { CourseImport } from "../hooks/useImportCourses";
import { cleanPath } from "../../../utils/zip-utils";
import Module from "../../../utils/interfaces/module";
import Parcours from "../../../utils/interfaces/parcours";
import Lesson from "../../../utils/interfaces/lesson";
import { marked } from "marked";
import { cleanActivityTextContent } from "../../../utils/helpers/text-helpers";
import Tag from "../../../utils/interfaces/tag";


export const getMimeType = (filename: string): string => {
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

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
};


type JsonFileFormat = {
  type: "text" | "file";
  title: string;
  course: string;
  section: string;
  order: number;
  path: string;
};

/**
 * Analyse les balises <img> d'un contenu HTML, extrait les fichiers binaires du zip correspondants,
 * génère des ObjectURLs de prévisualisation locale et planifie leur téléversement futur.
 */
export async function processHtmlImages(
  htmlContent: string,
  zip: JSZip,
  rootPath: string,
): Promise<{ newHtml: string; newImages: QueuedImage[] }> {
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
}

/**
 * Service unifié de parsing pour les packages ZIP.
 * Prend un File (sélectionné manuellement) ou un Blob (reçu depuis le endpoint de conversion MBZ).
 */
export async function parseCourseZip(
  file: File | Blob,
  courseSlug?: string,
): Promise<{
  courses: CourseImport[];
  images: QueuedImage[];
  error?: string;
  tooltipErrorTip?: string;
}> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const foundFiles = loadedZip.file(/(export|index)\.json$/);

  const exportFile = foundFiles.find(
    (f) =>
      !f.name.includes("__MACOSX") &&
      !f.name.split("/").pop()?.startsWith("._"),
  );

  if (!exportFile) {
    throw new Error(
      "Fichier d'index introuvable au sein de l'archive d'exportation.",
    );
  }

  const fileName = exportFile.name.split("/").pop() || "";
  const rootPath = exportFile.name.replace(fileName, "");
  const jsonContent = await exportFile.async("string");
  const flatActivities: JsonFileFormat[] = JSON.parse(jsonContent);

  const coursesMap = new Map<string, CourseImport>();
  const allExtractedImages: QueuedImage[] = [];
  let globalHasError = false;

  console.log("flatActivities", flatActivities);

  for (const item of flatActivities) {
    if (!coursesMap.has(item.course)) {
      coursesMap.set(item.course, {
        id: Math.random(),
        title: item.course,
        courseSlug,
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
      (l) => l.title === item.section,
    ) as Lesson & { hasError?: boolean };

    if (!currentLesson) {
      currentLesson = {
        id: Math.random(),
        title: item.section,
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
        globalHasError = true;
        activity.hasError = true;
        currentLesson.hasError = true;
        currentCourse.hasError = true;
      } else {
        if (item.type === "text") {
          const markdownContent = await fileInZip.async("string");
          let htmlContent = await marked.parse(markdownContent);
          htmlContent = cleanActivityTextContent(htmlContent);

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

  return {
    courses: Array.from(coursesMap.values()),
    images: allExtractedImages,
    error: globalHasError
      ? "Un ou plusieurs fichiers associés aux activités sont manquants."
      : undefined,
    tooltipErrorTip: globalHasError ? "Fichiers manquants." : undefined,
  };
}
