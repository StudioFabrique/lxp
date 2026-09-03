import type { Prisma } from "@prisma/client";
import { jest } from "@jest/globals";

import { removeParcoursContactsFromModules } from "../remove-parcours-contacts-from-modules.ts";

describe("retrait des ressources pédagogiques d'un parcours", () => {
  it("supprime leurs affectations dans les modules du même parcours", async () => {
    const deleteMany = jest
      .fn<() => Promise<{ count: number }>>()
      .mockResolvedValue({ count: 2 });
    const tx = {
      contactsOnModule: { deleteMany },
    } as unknown as Prisma.TransactionClient;

    await removeParcoursContactsFromModules(tx, 12, [3, 5]);

    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        contactId: { in: [3, 5] },
        module: { parcoursId: 12 },
      },
    });
  });

  it("ne lance aucune requête lorsqu'aucun contact n'est retiré", async () => {
    const deleteMany = jest.fn();
    const tx = {
      contactsOnModule: { deleteMany },
    } as unknown as Prisma.TransactionClient;

    await removeParcoursContactsFromModules(tx, 12, []);

    expect(deleteMany).not.toHaveBeenCalled();
  });
});
