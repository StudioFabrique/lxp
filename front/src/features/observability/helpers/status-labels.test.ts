import { describe, expect, it } from "vitest";
import { statusLabel } from "./status-labels";

describe("libellés des codes HTTP", () => {
  it("traduit les codes courants, en chaîne ou en nombre", () => {
    expect(statusLabel("403")).toBe("Accès refusé");
    expect(statusLabel(503)).toBe("Service indisponible");
  });

  it("garde un code inconnu lisible", () => {
    expect(statusLabel(418)).toBe("Code 418");
  });
});
