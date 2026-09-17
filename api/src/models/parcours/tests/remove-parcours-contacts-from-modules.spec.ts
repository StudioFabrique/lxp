import type { TransactionClient } from "../../../utils/db.ts";
import { jest } from "@jest/globals";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";

const deleteMany = jest.fn<() => Promise<number>>();
const associationModel = createModelMock(
  { deleteAndCount: deleteMany },
  { evaluateWhere: true },
);

const { removeParcoursContactsFromModules } =
  await import("../remove-parcours-contacts-from-modules.ts");

describe("retrait des ressources pédagogiques d'un parcours", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("supprime leurs affectations dans les modules du même parcours", async () => {
    deleteMany.mockResolvedValue(2);
    const tx = {
      orm: { public: { ContactsOnModule: associationModel } },
    } as unknown as TransactionClient;

    await removeParcoursContactsFromModules(tx, 12, [3, 5]);
  });

  it("ne lance aucune requête lorsqu'aucun contact n'est retiré", async () => {
    const tx = {
      orm: { public: { ContactsOnModule: associationModel } },
    } as unknown as TransactionClient;

    await removeParcoursContactsFromModules(tx, 12, []);

    expect(deleteMany).not.toHaveBeenCalled();
  });
});
