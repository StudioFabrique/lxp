import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const group = { createdBy: "creator" };
const groupLean = jest.fn<() => Promise<unknown>>();
const userLean = jest.fn<() => Promise<unknown>>();
const findUsers = jest.fn((_filter: unknown, _projection: unknown) => ({ sort: () => ({ lean: userLean }) }));
const first = jest.fn<() => Promise<unknown>>();
const query = { include: () => query, first };

jest.unstable_mockModule("../src/utils/db.ts", () => ({
  prisma: { orm: { public: { Group: { where: () => query } } } },
}));
jest.unstable_mockModule("../src/utils/interfaces/db/group.ts", () => ({
  default: { findOne: () => ({ populate: () => ({ lean: groupLean }) }) },
}));
jest.unstable_mockModule("../src/utils/interfaces/db/user.ts", () => ({ default: { find: findUsers } }));
jest.unstable_mockModule("../src/utils/interfaces/db/role.ts", () => ({
  default: { find: () => ({ lean: async () => [{ _id: "teacher-role" }] }) },
}));
const { default: getGroupDetails } = await import("../src/models/group/get-group-details.ts");

describe("formateurs liés aux groupes", () => {
  beforeEach(() => {
    findUsers.mockClear();
    groupLean.mockResolvedValue(group);
    userLean.mockResolvedValue([
      { _id: "creator", firstname: "Alice", lastname: "Martin", email: "alice@example.com" },
      { _id: "teacher", firstname: "Jean", lastname: "Dupont", email: "jean@example.com" },
    ]);
  });

  test("réunit le créateur et les formateurs des parcours sans doublonner les identifiants", async () => {
    first.mockResolvedValue({ parcours: [
      { parcoursId: 1, parcours: { formationId: 1, title: "Parcours A", contacts: [{ contact: { idMdb: "creator" } }, { contact: { idMdb: "teacher" } }] } },
      { parcoursId: 2, parcours: { formationId: 1, title: "Parcours B", contacts: [{ contact: { idMdb: "teacher" } }] } },
    ] });
    const result = await getGroupDetails("group");
    expect(findUsers).toHaveBeenCalledWith({
      _id: { $in: ["creator", "teacher"] }, roles: { $in: ["teacher-role"] },
    }, { firstname: 1, lastname: 1, email: 1, isActive: 1 });
    expect(result?.teachers).toEqual([
      expect.objectContaining({ _id: "creator", isCreator: true, parcours: [{ id: 1, title: "Parcours A" }] }),
      expect.objectContaining({ _id: "teacher", isCreator: false, parcours: [{ id: 1, title: "Parcours A" }, { id: 2, title: "Parcours B" }] }),
    ]);
  });

  test("conserve le créateur formateur d’un groupe sans parcours", async () => {
    first.mockResolvedValue({ parcours: [] });
    userLean.mockResolvedValue([{ _id: "creator", firstname: "Alice", lastname: "Martin" }]);
    const result = await getGroupDetails("group");
    expect(result?.teachers).toEqual([expect.objectContaining({ isCreator: true, parcours: [] })]);
  });

  test("ne recherche pas les formateurs lorsque le groupe n’existe pas", async () => {
    groupLean.mockResolvedValue(null);
    first.mockResolvedValue(null);
    expect(await getGroupDetails("absent")).toBeUndefined();
    expect(findUsers).not.toHaveBeenCalled();
  });
});
