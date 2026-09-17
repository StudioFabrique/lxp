import { appSubjects, buildAbility } from "../ability.ts";
import {
  resourcesRbac,
  resourcesRbacByRank,
} from "../config/ressources-rbac.ts";

describe("permissions indépendantes des noms de rôles", () => {
  const roleNames = ["admin", "student", "teacher", "everything"];

  it("ne déclare plus les noms de rôles comme ressources", () => {
    const resources = resourcesRbac.map(({ name }) => name);
    for (const name of roleNames) {
      expect(resources).not.toContain(name);
      expect(appSubjects).not.toContain(name);
      expect(resourcesRbacByRank[0].read).not.toContain(name);
      expect(resourcesRbacByRank[2].read).not.toContain(name);
    }
    expect(resources).toContain("user");
    expect(resources).toContain("group");
  });

  it("conserve les droits sur les ressources métier", () => {
    const ability = buildAbility(["read:admin", "read:custom-role", "read:user", "read:group"]);
    expect(ability.rules).toEqual([
      { action: "read", subject: "user" },
      { action: "read", subject: "group" },
    ]);
  });
});
