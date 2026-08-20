import {
  escapeRegExp,
  exactInsensitive,
  isDuplicateKeyError,
  normalizeEmail,
} from "../../src/utils/unique-fields.ts";

describe("normalizeEmail", () => {
  it("aligne casse et espaces de bordure", () => {
    expect(normalizeEmail("  Jean.Dupont@Mail.FR ")).toBe(
      "jean.dupont@mail.fr",
    );
  });

  it("renvoie une chaîne vide pour une saisie vide", () => {
    expect(normalizeEmail("   ")).toBe("");
  });
});

describe("exactInsensitive", () => {
  it("reconnaît la même valeur écrite dans une autre casse", () => {
    expect(exactInsensitive("Promo 2025").test("promo 2025")).toBe(true);
    expect(exactInsensitive(" promo 2025 ").test("PROMO 2025")).toBe(true);
  });

  it("reste ancrée : un nom plus long n'est pas un doublon", () => {
    const matcher = exactInsensitive("Promo");
    expect(matcher.test("Promo 2025")).toBe(false);
    expect(matcher.test("Ancienne Promo")).toBe(false);
  });

  it("traite les caractères spéciaux littéralement", () => {
    // Sans échappement, « B.A » correspondrait à « BxA ».
    expect(exactInsensitive("B.A").test("BxA")).toBe(false);
    expect(exactInsensitive("B.A").test("b.a")).toBe(true);
  });

  it("échappe les métacaractères d'expression régulière", () => {
    expect(escapeRegExp("a+b(c)")).toBe("a\\+b\\(c\\)");
  });
});

describe("isDuplicateKeyError", () => {
  it("reconnaît les codes d'index unique de MongoDB", () => {
    expect(isDuplicateKeyError({ code: 11000 })).toBe(true);
    expect(isDuplicateKeyError({ code: 11001 })).toBe(true);
  });

  it("laisse passer les autres erreurs", () => {
    expect(isDuplicateKeyError({ code: 121 })).toBe(false);
    expect(isDuplicateKeyError(new Error("boom"))).toBe(false);
    expect(isDuplicateKeyError(undefined)).toBe(false);
  });
});
