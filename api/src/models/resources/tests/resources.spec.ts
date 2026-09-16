import { jest } from "@jest/globals";
import {
  createModelMock,
  createWhereRecorder,
  requireDatabaseRow,
} from "../../../../tests/utils/prisma-mock.ts";
const findResource = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const updateResource = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const bonusFind = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const bonusUpdate = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const bonusDelete = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const lessonFind = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const cleanup = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const resourceModel = createModelMock(
  { first: findResource, update: updateResource },
  { evaluateWhere: true, evaluateIncludes: true },
);
const adminModel = createModelMock(
  { first: jest.fn(async () => ({ id: 1 })) },
  { evaluateWhere: true },
);
const tagModel = createModelMock(
  {
    all: jest.fn(async () => []),
    createAndCount: jest.fn(async () => 0),
  },
  { evaluateWhere: true },
);
const bonusModel = createModelMock(
  { first: bonusFind, update: bonusUpdate, delete: bonusDelete },
  { evaluateWhere: true },
);
const lessonModel = createModelMock(
  { first: lessonFind },
  { evaluateWhere: true },
);
const prisma = {
  orm: {
    public: {
      Resource: resourceModel,
      Admin: adminModel,
      Tag: tagModel,
      ResourceBonusActivity: bonusModel,
      ResourceActivity: lessonModel,
    },
  },
};
const { filters, whereFromObject } = createWhereRecorder();
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: {
    ...prisma,
    transaction: async (callback: (tx: unknown) => Promise<unknown>) =>
      callback(prisma),
  },
}));
jest.unstable_mockModule("../../../utils/prisma-query.ts", () => ({
  whereFromObject,
  requireDatabaseRow,
}));
jest.unstable_mockModule("../../../utils/interfaces/db/user.ts", () => ({
  default: {
    findById: jest.fn(async () => ({ firstname: "Auteur", lastname: "Test" })),
  },
}));
jest.unstable_mockModule("../../../helpers/activity-file-cleanup.ts", () => ({
  collectUnusedActivityFiles: jest.fn(async () => []),
  deleteActivityFiles: cleanup,
}));
const { default: putResource } = await import("../put-resource.ts");
const { default: getDetails } = await import("../get-resource-details.ts");
const { default: renameFile } =
  await import("../../activity/update-activity/put-resource.ts");
const { default: deleteFile } =
  await import("../../activity/delete-resource.ts");
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
beforeEach(() => {
  jest.clearAllMocks();
  filters.length = 0;
});
describe("Ressources supplémentaires", () => {
  it("retrouve la ressource par identifiant pour la renommer et conserve son image", async () => {
    findResource
      .mockResolvedValueOnce({
        id: 7,
        title: "Ancien titre",
        imageUrl: "image.png",
      })
      .mockResolvedValueOnce(null);
    updateResource.mockResolvedValue({
      id: 7,
      title: "Nouveau titre",
      imageUrl: "image.png",
    });
    await putResource(
      "user",
      7,
      "Nouveau titre",
      "Description",
      [],
      null,
      true,
    );
    expect(filters).toContainEqual({ id: 7 });
    const args = updateResource.mock.calls[0][0] as {
      title: string;
      imageUrl?: string;
    };
    expect(args.title).toBe("Nouveau titre");
    expect(args).not.toHaveProperty("imageUrl");
  });
  it("refuse le titre d'une autre ressource", async () => {
    findResource
      .mockResolvedValueOnce({ id: 7 })
      .mockResolvedValueOnce({ id: 8 });
    await expect(
      putResource("user", 7, "Titre existant", "", [], null, true),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(updateResource).not.toHaveBeenCalled();
  });
  it("expose les fichiers bonus au lecteur commun", async () => {
    const files = [{ id: 12, label: "Document", url: "doc.pdf" }];
    findResource.mockResolvedValueOnce({
      id: 7,
      tags: [],
      bonusActivities: [{ id: 3, resourceBonusActivities: files }],
    });
    expect((await getDetails(7)).activities[0].resourceActivities).toEqual(
      files,
    );
  });
  it("renomme un fichier bonus sans modifier un fichier de leçon portant le même identifiant", async () => {
    bonusFind.mockResolvedValueOnce({ id: 12 });
    bonusUpdate.mockResolvedValueOnce({ id: 12, label: "Nouveau nom" });
    await renameFile({
      params: { resourceId: "12" },
      body: { parent: "resource", label: "Nouveau nom" },
      auth: { userId: "user" },
    } as unknown as CustomRequest);
    expect(bonusUpdate).toHaveBeenCalledWith({ label: "Nouveau nom" });
    expect(filters).toContainEqual({ id: 12 });
    expect(lessonFind).not.toHaveBeenCalled();
  });
  it("supprime un fichier bonus et applique le nettoyage des fichiers partagés", async () => {
    bonusFind.mockResolvedValueOnce({ url: "doc.pdf" });
    bonusDelete.mockResolvedValueOnce({ id: 12 });
    await deleteFile(12, "user", "resource");
    expect(bonusDelete).toHaveBeenCalledWith();
    expect(filters).toContainEqual({ id: 12 });
    expect(lessonFind).not.toHaveBeenCalled();
    expect(cleanup).toHaveBeenCalledWith([]);
  });
});
