import {
  HEARTBEAT_INTERVAL_MS,
  isContentType,
} from "../../../config/content-read.ts";
import { computeHeartbeatCredit } from "../content-read-repository.ts";

describe("computeHeartbeatCredit", () => {
  const start = new Date("2026-08-19T10:00:00.000Z");
  const at = (seconds: number) =>
    new Date(start.getTime() + seconds * 1000);

  it("crédite l'écart réel entre deux battements", () => {
    expect(computeHeartbeatCredit(start, at(30))).toBe(30_000);
  });

  it("plafonne à deux intervalles", () => {
    // Un onglet laissé ouvert toute la nuit ne doit pas créditer huit heures.
    expect(computeHeartbeatCredit(start, at(8 * 3600))).toBe(
      HEARTBEAT_INTERVAL_MS * 2,
    );
  });

  it("ne crédite rien pour une horloge client en avance", () => {
    expect(computeHeartbeatCredit(at(60), start)).toBe(0);
  });

  it("ne crédite rien pour un battement instantané", () => {
    expect(computeHeartbeatCredit(start, start)).toBe(0);
  });
});

describe("isContentType", () => {
  it("accepte les quatre niveaux de contenu", () => {
    expect(["module", "course", "lesson", "activity"].every(isContentType)).toBe(
      true,
    );
  });

  it("rejette tout autre niveau", () => {
    expect(isContentType("parcours")).toBe(false);
    expect(isContentType(undefined)).toBe(false);
  });
});
