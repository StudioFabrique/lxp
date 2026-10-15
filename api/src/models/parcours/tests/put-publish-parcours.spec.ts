import { jest } from "@jest/globals";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";

const firstParcours = jest.fn<(...args: any[]) => Promise<any>>();
const updateParcours = jest.fn<(...args: any[]) => Promise<any>>();
const firstGroupLink = jest.fn<(...args: any[]) => Promise<any>>();

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: {
    orm: {
      public: {
        Parcours: createModelMock({ first: firstParcours, update: updateParcours }),
        GroupsOnParcours: createModelMock({ first: firstGroupLink }),
      },
    },
  },
}));
jest.unstable_mockModule("../../../utils/require-database-row.ts", () => ({
  requireDatabaseRow: (row: unknown) => row,
}));

const { default: putPublishParcours } = await import("../put-publish-parcours.ts");

describe("putPublishParcours", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    firstParcours.mockResolvedValue({ id: 1 });
    updateParcours.mockResolvedValue({ id: 1, isPublished: true });
  });

  it("refuse de publier un parcours sans groupe d'apprenants", async () => {
    firstGroupLink.mockResolvedValue(null);

    await expect(putPublishParcours(1, true)).rejects.toMatchObject({ statusCode: 409 });
    expect(updateParcours).not.toHaveBeenCalled();
  });

  it("publie un parcours qui a un groupe", async () => {
    firstGroupLink.mockResolvedValue({ parcoursId: 1, groupId: 2 });

    await expect(putPublishParcours(1, true)).resolves.toMatchObject({ isPublished: true });
    expect(updateParcours).toHaveBeenCalledWith({ isPublished: true });
  });

  it("permet toujours de repasser un parcours sans groupe en brouillon", async () => {
    firstGroupLink.mockResolvedValue(null);
    updateParcours.mockResolvedValue({ id: 1, isPublished: false });

    await expect(putPublishParcours(1, false)).resolves.toMatchObject({ isPublished: false });
    expect(firstGroupLink).not.toHaveBeenCalled();
  });

  it("signale un parcours inexistant", async () => {
    firstParcours.mockResolvedValue(null);

    await expect(putPublishParcours(9, true)).rejects.toMatchObject({ statusCode: 404 });
  });
});
