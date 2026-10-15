import { jest } from "@jest/globals";

const updateOne = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../../utils/interfaces/db/role.ts", () => ({
  default: { updateOne },
}));

const { syncSystemRoleLabels } = await import("../sync-system-role-labels.ts");

describe("synchronisation des libellés des rôles système", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    updateOne.mockResolvedValue({});
  });

  it("met à jour les rôles admin, teacher et student, en minuscules", async () => {
    await syncSystemRoleLabels({
      "1": "Direction",
      "2": "Formateur",
      "3": "Étudiant",
      "4": "Invité",
    });

    expect(updateOne).toHaveBeenCalledTimes(3);
    expect(updateOne).toHaveBeenCalledWith(
      { role: "admin", rank: 1, protection: { $gte: 1 } },
      { $set: { label: "direction" } },
    );
    expect(updateOne).toHaveBeenCalledWith(
      { role: "teacher", rank: 2, protection: { $gte: 1 } },
      { $set: { label: "formateur" } },
    );
    expect(updateOne).toHaveBeenCalledWith(
      { role: "student", rank: 3, protection: { $gte: 1 } },
      { $set: { label: "étudiant" } },
    );
  });

  it("ne touche pas au rôle root ni aux rôles personnalisés", async () => {
    await syncSystemRoleLabels({ "1": "A1", "2": "B2", "3": "C3", "4": "D4" });
    const filters = updateOne.mock.calls.map(([filter]) => filter as { role: string });
    expect(filters.map(({ role }) => role).sort()).toEqual(["admin", "student", "teacher"]);
  });

  it("propage l'échec pour que les paramètres ne soient pas enregistrés", async () => {
    updateOne.mockRejectedValueOnce(new Error("mongo indisponible"));
    await expect(
      syncSystemRoleLabels({ "1": "A1", "2": "B2", "3": "C3", "4": "D4" }),
    ).rejects.toThrow("mongo indisponible");
  });
});
