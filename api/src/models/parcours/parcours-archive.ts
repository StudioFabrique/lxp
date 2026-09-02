import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import JSZip from "jszip";
import { z } from "zod";

import { getDuplicateIdentity } from "../../helpers/duplication.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

const ARCHIVE_FORMAT = "andria-parcours";
const ARCHIVE_VERSION = 1;
const MAX_ARCHIVE_ENTRIES = 20_000;
const MAX_UNCOMPRESSED_SIZE = 750 * 1024 * 1024;
const MAX_MANIFEST_SIZE = 10 * 1024 * 1024;

const uploadsRoot = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "uploads",
);
const activitiesRoot = path.join(uploadsRoot, "activities");

type AssetKind = "text" | "image" | "video" | "resource" | "cover";
type ActivityType = "text" | "image" | "video" | "resource" | "iframe";
type AssetReference =
  | { kind: "asset"; path: string }
  | { kind: "url"; url: string };

type ArchiveTag = { name: string; color: string };
type ArchiveQuiz = {
  title: string;
  type: string;
  questions: Array<{
    externalId: string | null;
    type: string;
    difficulty: string;
    prompt: string;
    explanationTrue: string | null;
    explanationWrong: string | null;
    tags: string[];
    data: Prisma.JsonValue;
  }>;
};

type ArchiveActivity = {
  title: string | null;
  type: ActivityType;
  order: number;
  source: AssetReference;
  embeddedImages: Array<{ originalUrl: string; source: AssetReference }>;
  resources: Array<{ label: string; order: number; source: AssetReference }>;
  quizzes: ArchiveQuiz[];
};

type ParcoursArchiveManifest = {
  format: typeof ARCHIVE_FORMAT;
  version: typeof ARCHIVE_VERSION;
  exportedAt: string;
  warnings: string[];
  formation: {
    title: string;
    description: string | null;
    code: string | null;
    level: string;
  };
  parcours: {
    title: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    degree: string | null;
    virtualClass: string | null;
    visibility: boolean;
    isPublished: boolean;
    image: AssetReference | null;
    thumb: AssetReference | null;
    objectives: string[];
    tags: ArchiveTag[];
    skills: Array<{ description: string; badge: string | null }>;
    bonusSkills: Array<{
      key: string;
      description: string;
      badge: string | null;
    }>;
    modules: Array<{
      title: string;
      description: string | null;
      quizInstructions: string | null;
      duration: number | null;
      rating: number | null;
      minDate: string | null;
      maxDate: string | null;
      image: AssetReference | null;
      thumb: AssetReference | null;
      bonusSkillKeys: string[];
      quizzes: ArchiveQuiz[];
      courses: Array<{
        title: string;
        description: string | null;
        image: AssetReference | null;
        virtualClass: string | null;
        visibility: boolean | null;
        scenario: boolean;
        isPublished: boolean;
        dates: Prisma.JsonValue[];
        order: number;
        tags: ArchiveTag[];
        quizzes: ArchiveQuiz[];
        lessons: Array<{
          title: string;
          description: string;
          modalite: string;
          order: number;
          visibility: boolean;
          isPublished: boolean;
          tag: ArchiveTag;
          activities: ArchiveActivity[];
        }>;
      }>;
    }>;
  };
};

const safeString = z.string().max(100_000);
const tagSchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().max(100),
});
const assetReferenceSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("asset"),
    path: z
      .string()
      .regex(/^assets\/[A-Za-z0-9._/-]+$/)
      .refine(isSafeAssetPath),
  }),
  z.object({ kind: z.literal("url"), url: safeString }),
]);
const quizSchema: z.ZodType<ArchiveQuiz> = z.object({
  title: z.string().max(500),
  type: z.string().max(100),
  questions: z
    .array(
      z.object({
        externalId: z.string().max(500).nullable(),
        type: z.string().max(100),
        difficulty: z.string().max(100),
        prompt: safeString,
        explanationTrue: safeString.nullable(),
        explanationWrong: safeString.nullable(),
        tags: z.array(z.string().max(255)).max(500),
        data: z.unknown() as z.ZodType<Prisma.JsonValue>,
      }),
    )
    .max(10_000),
});
const activitySchema: z.ZodType<ArchiveActivity> = z
  .object({
    title: z.string().max(500).nullable(),
    type: z.enum(["text", "image", "video", "resource", "iframe"]),
    order: z.number().int(),
    source: assetReferenceSchema,
    embeddedImages: z
      .array(
        z.object({ originalUrl: safeString, source: assetReferenceSchema }),
      )
      .max(2_000),
    resources: z
      .array(
        z.object({
          label: z.string().max(500),
          order: z.number().int(),
          source: assetReferenceSchema,
        }),
      )
      .max(2_000),
    quizzes: z.array(quizSchema).max(100),
  })
  .refine(
    (activity) => activity.type !== "iframe" || activity.source.kind === "url",
    { message: "Un contenu iframe doit référencer une URL.", path: ["source"] },
  );

const manifestSchema: z.ZodType<ParcoursArchiveManifest> = z.object({
  format: z.literal(ARCHIVE_FORMAT),
  version: z.literal(ARCHIVE_VERSION),
  exportedAt: z.iso.datetime(),
  warnings: z.array(z.string()).max(10_000),
  formation: z.object({
    title: z.string().min(1).max(500),
    description: safeString.nullable(),
    code: z.string().max(255).nullable(),
    level: z.string().max(255),
  }),
  parcours: z.object({
    title: z.string().min(1).max(500),
    description: safeString.nullable(),
    startDate: z.iso.datetime().nullable(),
    endDate: z.iso.datetime().nullable(),
    degree: z.string().max(500).nullable(),
    virtualClass: safeString.nullable(),
    visibility: z.boolean(),
    isPublished: z.boolean(),
    image: assetReferenceSchema.nullable(),
    thumb: assetReferenceSchema.nullable(),
    objectives: z.array(safeString).max(10_000),
    tags: z.array(tagSchema).max(10_000),
    skills: z
      .array(
        z.object({ description: safeString, badge: safeString.nullable() }),
      )
      .max(10_000),
    bonusSkills: z
      .array(
        z.object({
          key: z.string().max(100),
          description: safeString,
          badge: safeString.nullable(),
        }),
      )
      .max(10_000),
    modules: z
      .array(
        z.object({
          title: z.string().min(1).max(500),
          description: safeString.nullable(),
          quizInstructions: safeString.nullable(),
          duration: z.number().int().nullable(),
          rating: z.number().nullable(),
          minDate: z.iso.datetime().nullable(),
          maxDate: z.iso.datetime().nullable(),
          image: assetReferenceSchema.nullable(),
          thumb: assetReferenceSchema.nullable(),
          bonusSkillKeys: z.array(z.string()).max(10_000),
          quizzes: z.array(quizSchema).max(100),
          courses: z
            .array(
              z.object({
                title: z.string().min(1).max(500),
                description: safeString.nullable(),
                image: assetReferenceSchema.nullable(),
                virtualClass: safeString.nullable(),
                visibility: z.boolean().nullable(),
                scenario: z.boolean(),
                isPublished: z.boolean(),
                dates: z
                  .array(z.unknown() as z.ZodType<Prisma.JsonValue>)
                  .max(10_000),
                order: z.number().int(),
                tags: z.array(tagSchema).max(10_000),
                quizzes: z.array(quizSchema).max(100),
                lessons: z
                  .array(
                    z.object({
                      title: z.string().min(1).max(500),
                      description: safeString,
                      modalite: z.string().max(255),
                      order: z.number().int(),
                      visibility: z.boolean(),
                      isPublished: z.boolean(),
                      tag: tagSchema,
                      activities: z.array(activitySchema).max(10_000),
                    }),
                  )
                  .max(10_000),
              }),
            )
            .max(10_000),
        }),
      )
      .max(10_000),
  }),
});

function httpError(statusCode: number, message: string) {
  return Object.assign(new Error(message), { statusCode });
}

function dateString(value: Date | null) {
  return value?.toISOString() ?? null;
}

function imageExtension(value: Uint8Array) {
  const buffer = Buffer.from(value);
  if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])))
    return ".png";
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])))
    return ".jpg";
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return ".webp";
  if (buffer.subarray(0, 3).toString("ascii") === "GIF") return ".gif";
  return ".bin";
}

function slug(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "parcours"
  );
}

function quizToArchive(quiz: any): ArchiveQuiz {
  return {
    title: quiz.title,
    type: quiz.type,
    questions: quiz.questions.map((question: any) => ({
      externalId: question.externalId,
      type: question.type,
      difficulty: question.difficulty,
      prompt: question.prompt,
      explanationTrue: question.explanationTrue,
      explanationWrong: question.explanationWrong,
      tags: question.tags,
      data: question.data,
    })),
  };
}

export async function exportParcoursArchive(parcoursId: number) {
  const source = await prisma.parcours.findUnique({
    where: { id: parcoursId },
    include: {
      formation: true,
      objectives: true,
      tags: { include: { tag: true } },
      skills: { include: { skill: true } },
      bonusSkills: true,
      modules: {
        orderBy: { id: "asc" },
        include: {
          bonusSkills: true,
          quizzes: {
            where: { courseId: null, activityId: null },
            include: { questions: true },
          },
          courses: {
            orderBy: { order: "asc" },
            include: {
              tags: { include: { tag: true } },
              quizzes: {
                where: { activityId: null },
                include: { questions: true },
              },
              lessons: {
                orderBy: { order: "asc" },
                include: {
                  tag: true,
                  activities: {
                    orderBy: { order: "asc" },
                    include: {
                      resourceActivities: { orderBy: { order: "asc" } },
                      quizzes: { include: { questions: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!source) throw httpError(404, "Le parcours n'existe pas.");

  const zip = new JSZip();
  const warnings: string[] = [];
  const archivedFiles = new Map<string, string>();
  const addBuffer = (
    value: Uint8Array | null,
    archiveBase: string,
  ): AssetReference | null => {
    if (!value) return null;
    const buffer = Buffer.from(value);
    const archivePath = `${archiveBase}${imageExtension(buffer)}`;
    zip.file(archivePath, buffer, { compression: "STORE" });
    return { kind: "asset", path: archivePath };
  };
  const addActivityFile = async (
    url: string,
    kind: Exclude<AssetKind, "cover">,
    archiveBase: string,
  ): Promise<AssetReference> => {
    if (!url || /^(?:https?:|data:|blob:)/i.test(url.trim()))
      return { kind: "url", url };
    const directory =
      kind === "text" ? "" : kind === "resource" ? "files" : `${kind}s`;
    const filename = path.basename(url.split(/[?#]/)[0]);
    const filePath = path.join(activitiesRoot, directory, filename);
    const dedupeKey = `${kind}:${filePath}`;
    const existing = archivedFiles.get(dedupeKey);
    if (existing) return { kind: "asset", path: existing };
    try {
      const contents = await fs.readFile(filePath);
      const archivePath = `${archiveBase}${path.extname(filename) || (kind === "text" ? ".html" : ".bin")}`;
      zip.file(archivePath, contents, {
        compression: kind === "text" ? "DEFLATE" : "STORE",
      });
      archivedFiles.set(dedupeKey, archivePath);
      return { kind: "asset", path: archivePath };
    } catch {
      warnings.push(`Fichier absent : ${kind}/${filename}`);
      return { kind: "url", url };
    }
  };

  const bonusSkillKeys = new Map(
    source.bonusSkills.map((skill, index) => [skill.id, `bonus-${index + 1}`]),
  );
  const modules = [] as ParcoursArchiveManifest["parcours"]["modules"];
  for (
    let moduleIndex = 0;
    moduleIndex < source.modules.length;
    moduleIndex += 1
  ) {
    const module = source.modules[moduleIndex];
    const courses = [] as (typeof modules)[number]["courses"];
    for (
      let courseIndex = 0;
      courseIndex < module.courses.length;
      courseIndex += 1
    ) {
      const course = module.courses[courseIndex];
      const lessons = [] as (typeof courses)[number]["lessons"];
      for (
        let lessonIndex = 0;
        lessonIndex < course.lessons.length;
        lessonIndex += 1
      ) {
        const lesson = course.lessons[lessonIndex];
        const activities: ArchiveActivity[] = [];
        for (
          let activityIndex = 0;
          activityIndex < lesson.activities.length;
          activityIndex += 1
        ) {
          const activity = lesson.activities[activityIndex];
          const base = `assets/modules/${moduleIndex + 1}/courses/${courseIndex + 1}/lessons/${lessonIndex + 1}/activities/${activityIndex + 1}`;
          const sourceReference: AssetReference =
            activity.type === "iframe"
              ? { kind: "url", url: activity.url }
              : await addActivityFile(
                  activity.url,
                  activity.type as Exclude<AssetKind, "cover">,
                  `${base}/content`,
                );
          const embeddedImages: ArchiveActivity["embeddedImages"] = [];
          if (activity.type === "text" && sourceReference.kind === "asset") {
            const html = await zip.file(sourceReference.path)?.async("string");
            for (const match of html?.matchAll(
              /<img[^>]+src=["']([^"']+)["']/gi,
            ) ?? []) {
              if (!match[1].includes("activities/images/")) continue;
              embeddedImages.push({
                originalUrl: match[1],
                source: await addActivityFile(
                  path.basename(match[1].split(/[?#]/)[0]),
                  "image",
                  `${base}/embedded/${embeddedImages.length + 1}`,
                ),
              });
            }
          }
          const resources = [];
          for (
            let resourceIndex = 0;
            resourceIndex < activity.resourceActivities.length;
            resourceIndex += 1
          ) {
            const resource = activity.resourceActivities[resourceIndex];
            resources.push({
              label: resource.label,
              order: resource.order,
              source: await addActivityFile(
                resource.url,
                "resource",
                `${base}/resources/${resourceIndex + 1}`,
              ),
            });
          }
          activities.push({
            title: activity.title,
            type: activity.type as ActivityType,
            order: activity.order,
            source: sourceReference,
            embeddedImages,
            resources,
            quizzes: activity.quizzes.map(quizToArchive),
          });
        }
        lessons.push({
          title: lesson.title,
          description: lesson.description,
          modalite: lesson.modalite,
          order: lesson.order,
          visibility: lesson.visibility,
          isPublished: lesson.isPublished,
          tag: { name: lesson.tag.name, color: lesson.tag.color },
          activities,
        });
      }
      courses.push({
        title: course.title,
        description: course.description,
        image: addBuffer(
          course.image,
          `assets/modules/${moduleIndex + 1}/courses/${courseIndex + 1}/image`,
        ),
        virtualClass: course.virtualClass,
        visibility: course.visibility,
        scenario: course.scenario,
        isPublished: course.isPublished,
        dates: course.dates as Prisma.JsonValue[],
        order: course.order,
        tags: course.tags.map(({ tag }) => ({
          name: tag.name,
          color: tag.color,
        })),
        quizzes: course.quizzes.map(quizToArchive),
        lessons,
      });
    }
    modules.push({
      title: module.title,
      description: module.description,
      quizInstructions: module.quizInstructions,
      duration: module.duration,
      rating: module.rating,
      minDate: dateString(module.minDate),
      maxDate: dateString(module.maxDate),
      image: addBuffer(module.image, `assets/modules/${moduleIndex + 1}/image`),
      thumb: addBuffer(module.thumb, `assets/modules/${moduleIndex + 1}/thumb`),
      bonusSkillKeys: module.bonusSkills
        .map(({ bonusSkillId }) => bonusSkillKeys.get(bonusSkillId))
        .filter((key): key is string => Boolean(key)),
      quizzes: module.quizzes.map(quizToArchive),
      courses,
    });
  }

  const manifest: ParcoursArchiveManifest = {
    format: ARCHIVE_FORMAT,
    version: ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    warnings,
    formation: {
      title: source.formation.title,
      description: source.formation.description,
      code: source.formation.code,
      level: source.formation.level,
    },
    parcours: {
      title: source.title,
      description: source.description,
      startDate: dateString(source.startDate),
      endDate: dateString(source.endDate),
      degree: source.degree,
      virtualClass: source.virtualClass,
      visibility: source.visibility,
      isPublished: source.isPublished,
      image: addBuffer(source.image, "assets/parcours/image"),
      thumb: addBuffer(source.thumb, "assets/parcours/thumb"),
      objectives: source.objectives.map(({ description }) => description),
      tags: source.tags.map(({ tag }) => ({
        name: tag.name,
        color: tag.color,
      })),
      skills: source.skills.map(({ skill }) => ({
        description: skill.description,
        badge: skill.badge,
      })),
      bonusSkills: source.bonusSkills.map((skill) => ({
        key: bonusSkillKeys.get(skill.id)!,
        description: skill.description,
        badge: skill.badge,
      })),
      modules,
    },
  };
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  return {
    buffer: await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    }),
    filename: `${slug(source.title)}.zip`,
    warnings,
  };
}

export function isSafeAssetPath(assetPath: string) {
  return (
    assetPath.startsWith("assets/") && !assetPath.split("/").includes("..")
  );
}

export function parseParcoursArchiveManifest(value: unknown) {
  const parsed = manifestSchema.safeParse(value);
  if (!parsed.success) {
    throw httpError(
      400,
      "Le format du manifeste n'est pas valide ou n'est pas pris en charge.",
    );
  }
  return parsed.data;
}

function collectAssetReferences(manifest: ParcoursArchiveManifest) {
  const references: Array<{ reference: AssetReference; kind: AssetKind }> = [];
  const add = (reference: AssetReference | null, kind: AssetKind) => {
    if (reference?.kind === "asset") references.push({ reference, kind });
  };
  add(manifest.parcours.image, "cover");
  add(manifest.parcours.thumb, "cover");
  for (const module of manifest.parcours.modules) {
    add(module.image, "cover");
    add(module.thumb, "cover");
    for (const course of module.courses) {
      add(course.image, "cover");
      for (const lesson of course.lessons)
        for (const activity of lesson.activities) {
          add(activity.source, activity.type as AssetKind);
          for (const embedded of activity.embeddedImages)
            add(embedded.source, "image");
          for (const resource of activity.resources)
            add(resource.source, "resource");
        }
    }
  }
  return references;
}

async function createQuiz(
  tx: Prisma.TransactionClient,
  quiz: ArchiveQuiz,
  relation: { moduleId?: number; courseId?: number; activityId?: number },
) {
  await tx.quiz.create({
    data: {
      title: quiz.title,
      type: quiz.type,
      ...relation,
      questions: {
        create: quiz.questions.map((question) => ({
          externalId: question.externalId,
          type: question.type,
          difficulty: question.difficulty,
          prompt: question.prompt,
          explanationTrue: question.explanationTrue,
          explanationWrong: question.explanationWrong,
          tags: question.tags,
          data: question.data as Prisma.InputJsonValue,
          contentHash: null,
        })),
      },
    },
  });
}

export async function importParcoursArchive(
  archive: Buffer,
  userId: string,
  formationId?: number,
) {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(archive, { checkCRC32: true });
  } catch {
    throw httpError(400, "Le fichier ZIP est invalide ou corrompu.");
  }
  if (Object.keys(zip.files).length > MAX_ARCHIVE_ENTRIES)
    throw httpError(400, "L'archive contient trop de fichiers.");
  const declaredSize = Object.values(zip.files).reduce((total, entry) => {
    const metadata = entry as unknown as {
      _data?: { uncompressedSize?: number };
    };
    return total + (metadata._data?.uncompressedSize ?? 0);
  }, 0);
  if (declaredSize > MAX_UNCOMPRESSED_SIZE)
    throw httpError(
      413,
      "Le contenu décompressé de l'archive est trop volumineux.",
    );
  const manifestFile = zip.file("manifest.json");
  if (!manifestFile)
    throw httpError(400, "Le fichier manifest.json est absent de l'archive.");
  let manifestBuffer: Buffer;
  try {
    manifestBuffer = await manifestFile.async("nodebuffer");
  } catch {
    throw httpError(400, "Le manifeste JSON est illisible.");
  }
  if (manifestBuffer.length > MAX_MANIFEST_SIZE) {
    throw httpError(413, "Le manifeste de l'archive est trop volumineux.");
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(manifestBuffer.toString("utf8"));
  } catch {
    throw httpError(400, "Le manifeste JSON est invalide.");
  }
  const manifest = parseParcoursArchiveManifest(parsedJson);

  const [admin, mongoUser] = await Promise.all([
    prisma.admin.findFirst({ where: { idMdb: userId } }),
    User.findById(userId),
  ]);
  if (!admin) throw httpError(404, "L'utilisateur n'existe pas.");
  const author = mongoUser
    ? `${mongoUser.firstname} ${mongoUser.lastname}`
    : "Import";

  const writtenFiles: string[] = [];
  const importedAssets = new Map<
    string,
    { value: string; buffer: Buffer; kind: AssetKind }
  >();
  let uncompressedSize = 0;
  try {
    const assetReferences = collectAssetReferences(manifest);
    const assetUsages = new Map<string, number>();
    for (const { reference } of assetReferences) {
      if (reference.kind === "asset")
        assetUsages.set(
          reference.path,
          (assetUsages.get(reference.path) ?? 0) + 1,
        );
    }
    for (const { reference, kind } of assetReferences) {
      if (reference.kind !== "asset" || importedAssets.has(reference.path))
        continue;
      if (!isSafeAssetPath(reference.path))
        throw httpError(400, "Un chemin de fichier de l'archive est invalide.");
      const entry = zip.file(reference.path);
      if (!entry)
        throw httpError(
          400,
          `Le fichier ${reference.path} est absent de l'archive.`,
        );
      const buffer = await entry.async("nodebuffer");
      uncompressedSize += buffer.length;
      if (uncompressedSize > MAX_UNCOMPRESSED_SIZE)
        throw httpError(
          413,
          "Le contenu décompressé de l'archive est trop volumineux.",
        );
      if (kind === "cover") {
        importedAssets.set(reference.path, {
          value: reference.path,
          buffer,
          kind,
        });
        continue;
      }
      const directory =
        kind === "text"
          ? activitiesRoot
          : path.join(
              activitiesRoot,
              kind === "resource" ? "files" : `${kind}s`,
            );
      const extension =
        path.extname(reference.path) || (kind === "text" ? ".html" : ".bin");
      const filename = `${randomUUID()}${extension.toLowerCase()}`;
      importedAssets.set(reference.path, { value: filename, buffer, kind });
      await fs.mkdir(directory, { recursive: true });
    }

    const resolveSource = (reference: AssetReference) =>
      reference.kind === "url"
        ? reference.url
        : (importedAssets.get(reference.path)?.value ?? "");
    for (const module of manifest.parcours.modules)
      for (const course of module.courses)
        for (const lesson of course.lessons)
          for (const activity of lesson.activities) {
            if (activity.source.kind !== "asset") continue;
            const imported = importedAssets.get(activity.source.path);
            if (!imported || imported.kind !== "text") continue;
            let html = imported.buffer.toString("utf8");
            for (const embedded of activity.embeddedImages) {
              if (embedded.source.kind !== "asset") continue;
              const replacement = resolveSource(embedded.source);
              if (replacement)
                html = html
                  .split(embedded.originalUrl)
                  .join(`/activities/images/${replacement}`);
            }
            imported.buffer = Buffer.from(html);
          }
    for (const imported of importedAssets.values()) {
      if (imported.kind === "cover") continue;
      const directory =
        imported.kind === "text"
          ? activitiesRoot
          : path.join(
              activitiesRoot,
              imported.kind === "resource" ? "files" : `${imported.kind}s`,
            );
      const destination = path.join(directory, imported.value);
      await fs.writeFile(destination, imported.buffer, { flag: "wx" });
      writtenFiles.push(destination);
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const selectedFormation =
          formationId === undefined
            ? null
            : await tx.formation.findUnique({ where: { id: formationId } });
        if (formationId !== undefined && !selectedFormation) {
          throw httpError(404, "La formation sélectionnée n'existe pas.");
        }
        const existingFormation = selectedFormation
          ? null
          : await tx.formation.findUnique({
              where: { title: manifest.formation.title },
            });
        const formation =
          selectedFormation ??
          existingFormation ??
          (await tx.formation.create({
            data: { ...manifest.formation, adminId: admin.id },
          }));
        const existingTitles = await tx.parcours.findMany({
          select: { title: true },
        });
        const normalizedTitles = new Set(
          existingTitles.map(({ title }) => title.trim().toLocaleLowerCase()),
        );
        const identity = normalizedTitles.has(
          manifest.parcours.title.trim().toLocaleLowerCase(),
        )
          ? getDuplicateIdentity(
              { title: manifest.parcours.title, duplicationIndex: 0 },
              existingTitles.map(({ title }) => title),
            )
          : { title: manifest.parcours.title, duplicationIndex: 0 };
        const cover = (
          reference: AssetReference | null,
        ): Uint8Array<ArrayBuffer> | null => {
          if (reference?.kind !== "asset") return null;
          const buffer = importedAssets.get(reference.path)?.buffer;
          if (!buffer) return null;
          const value = new Uint8Array(buffer.length);
          value.set(buffer);
          return value;
        };
        const createdParcours = await tx.parcours.create({
          data: {
            title: identity.title,
            duplicationIndex: identity.duplicationIndex,
            description: manifest.parcours.description,
            startDate: manifest.parcours.startDate
              ? new Date(manifest.parcours.startDate)
              : null,
            endDate: manifest.parcours.endDate
              ? new Date(manifest.parcours.endDate)
              : null,
            degree: manifest.parcours.degree,
            image: cover(manifest.parcours.image),
            thumb: cover(manifest.parcours.thumb),
            virtualClass: manifest.parcours.virtualClass,
            visibility: false,
            isPublished: false,
            author,
            adminId: admin.id,
            formationId: formation.id,
            objectives: {
              create: manifest.parcours.objectives.map((description) => ({
                description,
              })),
            },
            tags: {
              create: manifest.parcours.tags.map((tag) => ({
                tag: {
                  connectOrCreate: { where: { name: tag.name }, create: tag },
                },
              })),
            },
            skills: {
              create: manifest.parcours.skills.map((skill) => ({
                skill: {
                  connectOrCreate: {
                    where: { description: skill.description },
                    create: skill,
                  },
                },
              })),
            },
          },
        });
        const bonusSkillIds = new Map<string, number>();
        for (const skill of manifest.parcours.bonusSkills) {
          const created = await tx.bonusSkill.create({
            data: {
              description: skill.description,
              badge: skill.badge,
              parcoursId: createdParcours.id,
            },
          });
          bonusSkillIds.set(skill.key, created.id);
        }
        for (const module of manifest.parcours.modules) {
          const createdModule = await tx.module.create({
            data: {
              title: module.title,
              description: module.description,
              quizInstructions: module.quizInstructions,
              image: cover(module.image),
              thumb: cover(module.thumb),
              duration: module.duration,
              rating: module.rating,
              minDate: module.minDate ? new Date(module.minDate) : null,
              maxDate: module.maxDate ? new Date(module.maxDate) : null,
              author,
              adminId: admin.id,
              parcoursId: createdParcours.id,
              bonusSkills: {
                create: module.bonusSkillKeys
                  .map((key) => bonusSkillIds.get(key))
                  .filter((id): id is number => id !== undefined)
                  .map((id) => ({ bonusSkill: { connect: { id } } })),
              },
            },
          });
          for (const quiz of module.quizzes)
            await createQuiz(tx, quiz, { moduleId: createdModule.id });
          for (const course of module.courses) {
            const createdCourse = await tx.course.create({
              data: {
                title: course.title,
                description: course.description,
                image: cover(course.image),
                virtualClass: course.virtualClass,
                visibility: course.visibility,
                scenario: course.scenario,
                dates: course.dates as Prisma.InputJsonValue[],
                order: course.order,
                isPublished: false,
                author,
                adminId: admin.id,
                moduleId: createdModule.id,
                tags: {
                  create: course.tags.map((tag) => ({
                    tag: {
                      connectOrCreate: {
                        where: { name: tag.name },
                        create: tag,
                      },
                    },
                  })),
                },
              },
            });
            for (const quiz of course.quizzes)
              await createQuiz(tx, quiz, { courseId: createdCourse.id });
            for (const lesson of course.lessons) {
              const lessonTag = await tx.tag.upsert({
                where: { name: lesson.tag.name },
                update: {},
                create: lesson.tag,
              });
              const createdLesson = await tx.lesson.create({
                data: {
                  title: lesson.title,
                  description: lesson.description,
                  modalite: lesson.modalite,
                  order: lesson.order,
                  isPublished: false,
                  visibility: false,
                  author,
                  adminId: admin.id,
                  courseId: createdCourse.id,
                  tagId: lessonTag.id,
                },
              });
              for (const activity of lesson.activities) {
                const createdActivity = await tx.activity.create({
                  data: {
                    title: activity.title,
                    type: activity.type,
                    order: activity.order,
                    url: resolveSource(activity.source),
                    authorId: admin.id,
                    lessonId: createdLesson.id,
                    resourceActivities: {
                      create: activity.resources.map((resource) => ({
                        label: resource.label,
                        order: resource.order,
                        url: resolveSource(resource.source),
                      })),
                    },
                  },
                });
                for (const quiz of activity.quizzes)
                  await createQuiz(tx, quiz, {
                    activityId: createdActivity.id,
                  });
              }
            }
          }
        }
        for (const [archivePath, imported] of importedAssets) {
          if (imported.kind === "cover" || imported.kind === "text") continue;
          await tx.mediatheque.create({
            data: {
              type: imported.kind,
              url: imported.value,
              name: path.basename(archivePath),
              size: imported.buffer.length,
              used: assetUsages.get(archivePath) ?? 1,
              authorId: admin.id,
            },
          });
        }
        return createdParcours;
      },
      { maxWait: 10_000, timeout: 120_000 },
    );
    return {
      success: true as const,
      parcoursId: result.id,
      title: result.title,
      warnings: manifest.warnings,
    };
  } catch (error) {
    await Promise.all(
      writtenFiles.map((file) => fs.unlink(file).catch(() => undefined)),
    );
    throw error;
  }
}

export const parcoursArchiveFormat = {
  name: ARCHIVE_FORMAT,
  version: ARCHIVE_VERSION,
} as const;
