import { describe, expect, it } from "vitest";
import type User from "../interfaces/user";
import {
  getModulesLabel,
  getUserArea,
  getUserHomePath,
  hasRoleRank,
  isTeacherUser,
} from "./user-role";

const userWithRank = (rank: number) =>
  ({ roles: [{ rank }] }) as Pick<User, "roles">;

describe("user role navigation", () => {
  it("personnalise le libellé des modules pour un formateur", () => {
    expect(getModulesLabel(userWithRank(2), "Liste des modules")).toBe(
      "Mes modules",
    );
    expect(getModulesLabel(userWithRank(1), "Liste des modules")).toBe(
      "Liste des modules",
    );
    expect(
      getModulesLabel(
        { roles: [{ rank: 1 }, { rank: 2 }] } as Pick<User, "roles">,
        "Liste des modules",
      ),
    ).toBe("Liste des modules");
    expect(isTeacherUser(userWithRank(2))).toBe(true);
  });

  it.each([0, 1, 2])("routes rank %s to the staff area", (rank) => {
    const user = userWithRank(rank);
    expect(getUserArea(user)).toBe("staff");
    expect(getUserHomePath(user)).toBe("/admin");
  });

  it("routes rank 3 to the student area", () => {
    const user = userWithRank(3);
    expect(getUserArea(user)).toBe("student");
    expect(getUserHomePath(user)).toBe("/student");
    expect(hasRoleRank(user, [3])).toBe(true);
  });

  it("does not infer an area without a supported business rank", () => {
    expect(getUserArea(userWithRank(4))).toBeNull();
    expect(getUserHomePath(undefined)).toBeNull();
  });
});
