import fs from "node:fs";
import path from "node:path";

const migrationsDir = path.resolve(import.meta.dirname, "../../../migrations/app");

/**
 * Les migrations « données » (même contrat au départ et à l'arrivée) ne sont jouées par
 * `prisma db migrate --to current` que si la ref `current` pointe sur le dernier contrat.
 * Une ref périmée bloquerait silencieusement les prochaines migrations de schéma.
 */
describe("ref de migration « current »", () => {
  it("pointe sur le contrat produit par la dernière migration", () => {
    const names = fs
      .readdirSync(migrationsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d{8}T\d{4}_/.test(entry.name))
      .map((entry) => entry.name)
      .sort();
    const latest = JSON.parse(
      fs.readFileSync(path.join(migrationsDir, names[names.length - 1], "migration.json"), "utf8"),
    ) as { to: string };
    const ref = JSON.parse(
      fs.readFileSync(path.join(migrationsDir, "refs", "current.json"), "utf8"),
    ) as { hash: string; invariants: string[] };

    expect(ref.hash).toBe(latest.to);
  });
});
