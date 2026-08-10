import { describe, expect, it } from "vitest";
import {
  addStudentToGroupReturnPath,
  createStudentUrlFromGroup,
  getSafeGroupReturnPath,
  readGroupFormDraft,
} from "./group-form-draft";

describe("group form draft", () => {
  it("serializes the group form in the return URL", () => {
    const studentUrl = createStudentUrlFromGroup({
      pathname: "/admin/group/add",
      currentSearchParams: new URLSearchParams("parcours=12"),
      values: {
        name: "Promotion août",
        desc: "Groupe du matin",
        formationId: 4,
        parcoursId: 12,
      },
      students: [
        { id: "student-1", isActive: true },
        { id: "student-2", isActive: false },
      ],
    });

    const url = new URL(studentUrl, "http://lxp.local");
    expect(url.pathname).toBe("/admin/user/add");
    expect(url.searchParams.get("roleRank")).toBe("3");

    const returnTo = new URL(
      url.searchParams.get("returnTo")!,
      "http://lxp.local",
    );
    expect(returnTo.pathname).toBe("/admin/group/add");
    expect(returnTo.searchParams.get("groupName")).toBe("Promotion août");
    expect(returnTo.searchParams.get("groupDescription")).toBe(
      "Groupe du matin",
    );
    expect(returnTo.searchParams.get("groupStudents")).toBe(
      "student-1,student-2",
    );
    expect(returnTo.searchParams.get("groupActiveStudents")).toBe(
      "student-1",
    );
  });

  it("restores fields and students from search params", () => {
    const draft = readGroupFormDraft(
      new URLSearchParams({
        groupName: "Promo 2027",
        groupDescription: "Description",
        groupFormation: "5",
        groupParcours: "9",
        groupStudents: "student-1,student-2",
        groupActiveStudents: "student-1",
      }),
    );

    expect(draft).toEqual({
      values: {
        name: "Promo 2027",
        desc: "Description",
        formationId: 5,
        parcoursId: 9,
      },
      studentIds: ["student-1", "student-2"],
      activeStudentIds: ["student-1"],
    });
  });

  it("adds the created student without duplicating selected students", () => {
    const returnPath = addStudentToGroupReturnPath(
      "/admin/group/add?groupStudents=student-1",
      "student-1",
    );

    expect(returnPath).toBe(
      "/admin/group/add?groupStudents=student-1",
    );
  });

  it("rejects external and unrelated return paths", () => {
    expect(getSafeGroupReturnPath("https://example.com/admin/group/add")).toBe(
      null,
    );
    expect(getSafeGroupReturnPath("//example.com/admin/group/add")).toBe(null);
    expect(getSafeGroupReturnPath("/admin/user")).toBe(null);
  });
});
