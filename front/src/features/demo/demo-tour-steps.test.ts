import { describe, expect, it } from "vitest";
import { demoTourSteps } from "./demo-tour-steps";

describe("étapes de la visite guidée de démonstration", () => {
  for (const [layout, steps] of Object.entries(demoTourSteps)) {
    describe(`parcours ${layout}`, () => {
      it("déclare des étapes", () => {
        expect(steps.length).toBeGreaterThan(3);
      });

      it("donne à chaque étape un identifiant unique", () => {
        const ids = steps.map((step) => step.id);

        expect(ids.every(Boolean)).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it("cible des sélecteurs exploitables", () => {
        for (const step of steps) {
          expect(typeof step.target).toBe("string");
          expect(String(step.target).length).toBeGreaterThan(0);
        }
      });

      it("ouvre des pages du bon espace", () => {
        for (const step of steps) {
          expect(step.route).toBeDefined();
          expect(step.route).toMatch(new RegExp(`^/${layout}/`));
        }
      });

      it("rédige un titre et un contenu pour chaque étape", () => {
        for (const step of steps) {
          expect(step.title).toBeTruthy();
          expect(step.content).toBeTruthy();
        }
      });

      it("n'attend aucune action, la démonstration étant en lecture seule", () => {
        for (const step of steps) {
          expect(step).not.toHaveProperty("waitingForAction");
          expect(step).not.toHaveProperty("requirements");
        }
      });
    });
  }
});
