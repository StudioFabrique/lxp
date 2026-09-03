import {
  buildAttachedGroupVisibilityFilter,
  buildTeacherGroupVisibilityFilter,
} from "../accessible-groups.ts";

describe("périmètre des groupes d’un formateur", () => {
  it("inclut les groupes rattachés à ses parcours et ses groupes non rattachés", () => {
    expect(
      buildTeacherGroupVisibilityFilter(
        "teacher-id",
        [10],
        [
          { idMdb: "accessible", parcours: [{ parcoursId: 10 }] },
          { idMdb: "inaccessible", parcours: [{ parcoursId: 20 }] },
          { idMdb: "unassigned", parcours: [] },
        ],
      ),
    ).toEqual({
      $or: [
        { _id: { $in: ["accessible"] } },
        {
          _id: { $nin: ["accessible", "inaccessible"] },
          createdBy: "teacher-id",
        },
      ],
    });
  });

  it("n’accorde pas un groupe rattaché inaccessible même s’il a été créé par le formateur", () => {
    const filter = buildTeacherGroupVisibilityFilter(
      "teacher-id",
      [],
      [{ idMdb: "created-but-inaccessible", parcours: [{ parcoursId: 20 }] }],
    );

    expect(filter).toEqual({
      $or: [
        { _id: { $in: [] } },
        {
          _id: { $nin: ["created-but-inaccessible"] },
          createdBy: "teacher-id",
        },
      ],
    });
  });

  it("masque les groupes non rattachés aux profils non administrateurs et non formateurs", () => {
    expect(
      buildAttachedGroupVisibilityFilter([
        { idMdb: "attached", parcours: [{ parcoursId: 10 }] },
        { idMdb: "unassigned", parcours: [] },
      ]),
    ).toEqual({ _id: { $in: ["attached"] } });
  });
});
