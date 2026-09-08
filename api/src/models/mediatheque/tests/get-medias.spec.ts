import { jest } from "@jest/globals";

const readFile = jest.fn<(...args: unknown[]) => Promise<string>>();
const countMedias = jest.fn<(...args: unknown[]) => Promise<number>>();
const findMedias = jest.fn<(...args: unknown[]) => Promise<unknown[]>>();
const findActivities = jest.fn<(...args: unknown[]) => Promise<unknown[]>>();
const findBonusActivities = jest.fn<
  (...args: unknown[]) => Promise<unknown[]>
>();

jest.unstable_mockModule("node:fs/promises", () => ({
  default: { readFile },
}));
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: {
    mediatheque: { count: countMedias, findMany: findMedias },
    activity: { findMany: findActivities },
    bonusActivity: { findMany: findBonusActivities },
  },
}));

const { default: getMedias } = await import("../get-medias.ts");

beforeEach(() => {
  jest.clearAllMocks();
  countMedias.mockResolvedValue(1);
  findMedias.mockResolvedValue([
    {
      id: 1,
      type: "image",
      url: "illustration.png",
      name: "illustration.png",
      size: 2048,
      used: 1,
    },
  ]);
  findBonusActivities.mockResolvedValue([]);
});

describe("Médiathèque", () => {
  it("retrouve une image intégrée au contenu d'une activité texte", async () => {
    findActivities.mockResolvedValue([
      {
        id: 12,
        title: "Introduction",
        type: "text",
        order: 0,
        url: "contenu.html",
        resourceActivities: [],
        lesson: {
          id: 4,
          title: "Première leçon",
          course: {
            title: "Les bases",
            module: { id: 3, title: "Module 1" },
          },
        },
      },
    ]);
    readFile.mockResolvedValue(
      '<p><img src="/activities/images/illustration.png"></p>',
    );

    const result = await getMedias({ type: "image" });
    const cachedResult = await getMedias({ type: "image" });

    expect(result.medias[0].associatedActivities).toEqual([
      expect.objectContaining({
        id: 12,
        parent: "lesson",
        lessonId: 4,
        moduleId: 3,
      }),
    ]);
    expect(cachedResult.medias[0].associatedActivities).toHaveLength(1);
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  it("ignore un ancien fichier de contenu devenu introuvable", async () => {
    findActivities.mockResolvedValue([
      {
        id: 12,
        title: "Introduction",
        type: "text",
        order: 0,
        url: "contenu-supprime.html",
        resourceActivities: [],
        lesson: {
          id: 4,
          title: "Première leçon",
          course: {
            title: "Les bases",
            module: { id: 3, title: "Module 1" },
          },
        },
      },
    ]);
    readFile.mockRejectedValue(
      Object.assign(new Error("Fichier absent"), { code: "ENOENT" }),
    );

    const result = await getMedias({ type: "image" });

    expect(result.medias[0].associatedActivities).toEqual([]);
  });
});
