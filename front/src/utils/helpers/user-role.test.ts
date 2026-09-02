import { describe, expect, it } from "vitest";
import type User from "../interfaces/user";
import { getUserArea, getUserHomePath, hasRoleRank } from "./user-role";

const userWithRank = (rank: number) =>
  ({ roles: [{ rank }] }) as Pick<User, "roles">;

describe("user role navigation", () => {
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
