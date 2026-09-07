import {
  assertCanDeleteTags,
  assertCanManageTags,
  canDeleteTag,
  canManageTag,
  tagOwnerFor,
  type TagActor,
} from "../tag-access.ts";

describe("ownership des tags", () => {
  const teacher: TagActor = { userId: "teacher-1", isAdmin: false };
  const admin: TagActor = { userId: "admin-1", isAdmin: true };

  it("attribue les tags du formateur mais laisse ceux de l'admin globaux", () => {
    expect(tagOwnerFor(teacher)).toBe(teacher.userId);
    expect(tagOwnerFor(admin)).toBeNull();
  });

  it("autorise un teacher à supprimer son propre tag", () => {
    expect(canDeleteTag({ createdBy: teacher.userId }, teacher)).toBe(true);
    expect(canManageTag({ createdBy: teacher.userId }, teacher)).toBe(true);
  });

  it("interdit à un teacher les tags d'un autre compte et les tags historiques", () => {
    expect(canDeleteTag({ createdBy: "teacher-2" }, teacher)).toBe(false);
    expect(canDeleteTag({ createdBy: null }, teacher)).toBe(false);
    expect(() =>
      assertCanManageTags(
        [{ createdBy: null }],
        teacher,
        "Modification interdite",
      ),
    ).toThrow(expect.objectContaining({ statusCode: 403 }));
    let error: unknown;
    try {
      assertCanDeleteTags(
        [{ createdBy: teacher.userId }, { createdBy: "admin-1" }],
        teacher,
      );
    } catch (caughtError) {
      error = caughtError;
    }
    expect(error).toMatchObject({ statusCode: 403 });
  });

  it("autorise un administrateur à supprimer tous les tags", () => {
    expect(canDeleteTag({ createdBy: "teacher-1" }, admin)).toBe(true);
    expect(canDeleteTag({ createdBy: null }, admin)).toBe(true);
    expect(canManageTag({ createdBy: "teacher-1" }, admin)).toBe(true);
    expect(() =>
      assertCanDeleteTags(
        [{ createdBy: "teacher-1" }, { createdBy: null }],
        admin,
      ),
    ).not.toThrow();
  });
});
