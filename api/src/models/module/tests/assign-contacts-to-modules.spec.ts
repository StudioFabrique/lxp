import { jest } from "@jest/globals";

const moduleCount = jest.fn<() => Promise<number>>();
const contactCount = jest.fn<() => Promise<number>>();
const createMany = jest.fn<() => Promise<{ count: number }>>();
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      module: { count: moduleCount },
      contactsOnParcours: { count: contactCount },
      contactsOnModule: { createMany },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { $transaction: transaction },
}));

const { default: assignContactsToModules } = await import(
  "../assign-contacts-to-modules.ts"
);

describe("affectation rapide des ressources pédagogiques", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ajoute toutes les associations demandées sans doublons", async () => {
    moduleCount.mockResolvedValue(2);
    contactCount.mockResolvedValue(2);
    createMany.mockResolvedValue({ count: 4 });

    await expect(
      assignContactsToModules({
        parcoursId: 9,
        moduleIds: [3, 4, 4],
        contactIds: [7, 8, 8],
      }),
    ).resolves.toEqual({ count: 4 });

    expect(createMany).toHaveBeenCalledWith({
      data: [
        { moduleId: 3, contactId: 7 },
        { moduleId: 3, contactId: 8 },
        { moduleId: 4, contactId: 7 },
        { moduleId: 4, contactId: 8 },
      ],
      skipDuplicates: true,
    });
  });

  it("refuse une ressource qui n'appartient pas au parcours", async () => {
    moduleCount.mockResolvedValue(1);
    contactCount.mockResolvedValue(0);

    await expect(
      assignContactsToModules({
        parcoursId: 9,
        moduleIds: [3],
        contactIds: [7],
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(createMany).not.toHaveBeenCalled();
  });

  it("borne les modules au périmètre du formateur", async () => {
    moduleCount.mockResolvedValue(1);
    contactCount.mockResolvedValue(1);
    createMany.mockResolvedValue({ count: 1 });

    await assignContactsToModules(
      { parcoursId: 9, moduleIds: [3], contactIds: [7] },
      {
        kind: "teacher",
        parcoursIds: [9],
        directParcoursIds: [9],
        moduleIds: [3],
      },
    );

    expect(moduleCount).toHaveBeenCalledWith({
      where: {
        id: { in: [3] },
        parcoursId: 9,
        AND: [{ id: { in: [3] } }],
      },
    });
  });
});
