import { jest } from "@jest/globals";

const moduleCount = jest.fn<() => Promise<number>>();
const findContact = jest.fn<() => Promise<{ id: number } | null>>();
const deleteMany = jest.fn<() => Promise<{ count: number }>>();
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      module: { count: moduleCount },
      contact: { findUnique: findContact },
      contactsOnModule: { deleteMany },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { $transaction: transaction },
}));

const { default: removeContactFromModule } = await import(
  "../remove-contact-from-module.ts"
);

describe("retrait d'une ressource pédagogique d'un module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("supprime uniquement l'association demandée", async () => {
    moduleCount.mockResolvedValue(1);
    deleteMany.mockResolvedValue({ count: 1 });

    await expect(
      removeContactFromModule({ parcoursId: 9, moduleId: 3, contactId: 7 }),
    ).resolves.toEqual({ count: 1 });

    expect(deleteMany).toHaveBeenCalledWith({
      where: { moduleId: 3, contactId: 7 },
    });
  });

  it("borne le module au périmètre du formateur", async () => {
    moduleCount.mockResolvedValue(1);
    findContact.mockResolvedValue({ id: 12 });
    deleteMany.mockResolvedValue({ count: 1 });

    await removeContactFromModule(
      { parcoursId: 9, moduleId: 3, contactId: 7 },
      {
        kind: "teacher",
        parcoursIds: [9],
        directParcoursIds: [9],
        moduleIds: [3],
      },
      "teacher-id",
    );

    expect(moduleCount).toHaveBeenCalledWith({
      where: {
        id: 3,
        parcoursId: 9,
        AND: [{ id: { in: [3] } }],
      },
    });
  });

  it("empêche un formateur de retirer sa propre affectation", async () => {
    moduleCount.mockResolvedValue(1);
    findContact.mockResolvedValue({ id: 7 });

    await expect(
      removeContactFromModule(
        { parcoursId: 9, moduleId: 3, contactId: 7 },
        {
          kind: "teacher",
          parcoursIds: [9],
          directParcoursIds: [9],
          moduleIds: [3],
        },
        "teacher-id",
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
