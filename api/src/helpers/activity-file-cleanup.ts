import { requireDatabaseRow, whereFromObject } from "../utils/prisma-query.ts";
import type { TransactionClient } from "../utils/db.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "../utils/logs/logger.ts";

export type StoredActivityFileType = "text" | "image" | "video" | "resource";

export type StoredActivityFileReference = {
  url: string;
  type: StoredActivityFileType;
  trackedInMediatheque?: boolean;
};

const activityDirectory: Record<StoredActivityFileType, string> = {
  text: "",
  image: "images",
  video: "videos",
  resource: "files",
};

const activitiesRoot = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "activities",
);

const isExternalUrl = (url: string) =>
  /^(?:https?:|data:|blob:)/i.test(url.trim());

export function resolveActivityFilePath(
  reference: StoredActivityFileReference,
) {
  if (!reference.url || isExternalUrl(reference.url)) return null;

  const filename = path.basename(reference.url);
  if (!filename || filename === "." || filename === path.sep) return null;

  return path.join(activitiesRoot, activityDirectory[reference.type], filename);
}

export function extractLocalImagesFromHtml(html: string) {
  const references: StoredActivityFileReference[] = [];
  const imageRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = imageRegex.exec(html)) !== null) {
    const imageUrl = match[1];
    if (!imageUrl.includes("activities/images/")) continue;

    references.push({
      url: path.basename(imageUrl.split(/[?#]/)[0]),
      type: "image",
      trackedInMediatheque: true,
    });
  }

  return references;
}

async function countRemainingReferences(
  tx: TransactionClient,
  reference: StoredActivityFileReference,
) {
  if (reference.type === "resource") {
    const [activityResources, bonusResources] = await Promise.all([
      tx.orm.public.ResourceActivity.where((row) =>
        whereFromObject(row, { url: reference.url }),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
      tx.orm.public.ResourceBonusActivity.where((row) =>
        whereFromObject(row, { url: reference.url }),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
    ]);
    return activityResources + bonusResources;
  }

  const [activities, bonusActivities, resourceImages] = await Promise.all([
    tx.orm.public.Activity.where((row) =>
      whereFromObject(row, { url: reference.url }),
    )
      .aggregate((aggregate) => ({ total: aggregate.count() }))
      .then(({ total }) => total),
    tx.orm.public.BonusActivity.where((row) =>
      whereFromObject(row, { url: reference.url }),
    )
      .aggregate((aggregate) => ({ total: aggregate.count() }))
      .then(({ total }) => total),
    reference.type === "image"
      ? tx.orm.public.Resource.where((row) =>
          whereFromObject(row, { imageUrl: reference.url }),
        )
          .aggregate((aggregate) => ({ total: aggregate.count() }))
          .then(({ total }) => total)
      : Promise.resolve(0),
  ]);
  return activities + bonusActivities + resourceImages;
}

export async function collectUnusedActivityFiles(
  tx: TransactionClient,
  references: StoredActivityFileReference[],
) {
  const groupedReferences = new Map<
    string,
    StoredActivityFileReference & { removedUses: number }
  >();

  for (const reference of references) {
    if (!resolveActivityFilePath(reference)) continue;

    const key = `${reference.type}:${reference.url}`;
    const existing = groupedReferences.get(key);
    if (existing) {
      existing.removedUses += 1;
    } else {
      groupedReferences.set(key, { ...reference, removedUses: 1 });
    }
  }

  const filesToDelete: string[] = [];

  for (const reference of groupedReferences.values()) {
    const remainingReferences = await countRemainingReferences(tx, reference);
    let remainingMediaUses = 0;

    if (reference.trackedInMediatheque !== false) {
      const media = await tx.orm.public.Mediatheque.where((row) =>
        whereFromObject(row, { url: reference.url }),
      ).first();

      if (media) {
        remainingMediaUses = Math.max(
          remainingReferences,
          media.used - reference.removedUses,
          0,
        );

        if (remainingMediaUses === 0) {
          await tx.orm.public.Mediatheque.where((row) =>
            whereFromObject(row, { id: media.id }),
          )
            .delete()
            .then(requireDatabaseRow);
        } else {
          await tx.orm.public.Mediatheque.where((row) =>
            whereFromObject(row, { id: media.id }),
          )
            .update({ used: remainingMediaUses })
            .then(requireDatabaseRow);
        }
      }
    }

    if (remainingReferences === 0 && remainingMediaUses === 0) {
      const filePath = resolveActivityFilePath(reference);
      if (filePath) filesToDelete.push(filePath);
    }
  }

  return filesToDelete;
}

export async function deleteActivityFiles(filePaths: string[]) {
  await Promise.all(
    [...new Set(filePaths)].map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          logger.error(`Impossible de supprimer le fichier ${filePath}`, error);
        }
      }
    }),
  );
}
