import { jest } from "@jest/globals";
import removeUserFromGroups from "../remove-user-from-groups.ts";

describe("retrait d’un utilisateur des groupes MongoDB", () => {
  it("retire sa référence de tous les groupes auxquels il appartient", async () => {
    const updateMany = jest
      .fn<(filter: object, update: object) => Promise<unknown>>()
      .mockResolvedValue({ acknowledged: true, modifiedCount: 2 });

    await removeUserFromGroups("user-id", { updateMany });

    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(updateMany).toHaveBeenCalledWith(
      { users: "user-id" },
      { $pull: { users: "user-id" } },
    );
  });

  it("propage une erreur pour empêcher la suppression partielle du compte", async () => {
    const updateMany = jest
      .fn<(filter: object, update: object) => Promise<unknown>>()
      .mockRejectedValue(new Error("MongoDB indisponible"));

    await expect(
      removeUserFromGroups("user-id", { updateMany }),
    ).rejects.toThrow("MongoDB indisponible");
  });
});
