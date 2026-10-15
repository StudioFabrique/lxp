import { describe, expect, it } from "vitest";
import {
  DEFAULT_ROLE_LABELS,
  resolveRoleLabels,
  roleLabelsToFormValues,
} from "./helpers/role-labels";
import { roleLabelsSchema } from "./role-labels.schema";

const defaults = roleLabelsToFormValues(DEFAULT_ROLE_LABELS);

describe("schéma des libellés de rôles", () => {
  it("accepte les valeurs par défaut", () => {
    expect(roleLabelsSchema.safeParse(defaults).success).toBe(true);
  });

  it("normalise les espaces avant de valider", () => {
    const result = roleLabelsSchema.safeParse({ ...defaults, team: "  Ressources   pédagogiques " });
    expect(result.success && result.data.team).toBe("Ressources pédagogiques");
  });

  it.each([
    ["vide", " "],
    ["trop court", "A"],
    ["trop long", "a".repeat(41)],
    ["avec des chevrons", "<b>Admin</b>"],
  ])("refuse un libellé %s en rattachant l'erreur au champ", (_name, value) => {
    const result = roleLabelsSchema.safeParse({ ...defaults, admin: value });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.path).toEqual(["admin"]);
  });

  it("refuse deux rôles de même libellé, sans tenir compte de la casse", () => {
    const result = roleLabelsSchema.safeParse({ ...defaults, visitor: "APPRENANT" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues.map((issue) => issue.path[0]).sort()).toEqual(["student", "visitor"]);
  });
});

describe("resolveRoleLabels", () => {
  it("complète les libellés absents ou vides avec les valeurs par défaut", () => {
    expect(resolveRoleLabels({ "2": "Formateurs", "3": "  " })).toEqual({
      ...DEFAULT_ROLE_LABELS,
      2: "Formateurs",
    });
    expect(resolveRoleLabels(undefined)).toEqual(DEFAULT_ROLE_LABELS);
  });
});
