import {
  buildAbility,
  permissionNameToRule,
} from "../../src/utils/rbac/ability";

describe("CASL ability construction", () => {
  it("refuses everything by default", () => {
    const ability = buildAbility([]);

    expect(ability.can("read", "module")).toBe(false);
    expect(ability.can("delete", "role")).toBe(false);
  });

  it("unions valid permissions from every role", () => {
    const ability = buildAbility([
      "read:module",
      "write:module",
      "update:module",
      "delete:module",
      "layout:admin",
    ]);

    for (const action of ["read", "write", "update", "delete"] as const) {
      expect(ability.can(action, "module")).toBe(true);
    }
    expect(ability.can("layout", "admin")).toBe(true);
    expect(ability.can("read", "role")).toBe(false);
  });

  it("drops malformed, unknown action and unknown subject permissions", () => {
    expect(permissionNameToRule("module")).toBeNull();
    expect(permissionNameToRule("create:module")).toBeNull();
    expect(permissionNameToRule("read:not-declared")).toBeNull();

    const ability = buildAbility([
      "module",
      "create:module",
      "read:not-declared",
    ]);
    expect(ability.rules).toHaveLength(0);
  });
});
