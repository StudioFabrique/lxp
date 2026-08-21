import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { solveChallenge, type DemoChallenge } from "./altcha-solver";

const buildChallenge = (secret: number): DemoChallenge => {
  const salt = `sel.${Date.now() + 60_000}`;
  return {
    algorithm: "SHA-256",
    salt,
    challenge: createHash("sha256").update(salt + secret).digest("hex"),
    signature: "signature-de-test",
    maxnumber: 5_000,
  };
};

describe("résolution du défi anti-robot", () => {
  it("retrouve le nombre caché par le serveur", async () => {
    const solution = await solveChallenge(buildChallenge(1_234));

    expect(solution.number).toBe(1_234);
  });

  it("renvoie le défi et sa signature pour la vérification serveur", async () => {
    const challenge = buildChallenge(42);
    const solution = await solveChallenge(challenge);

    expect(solution.challenge).toBe(challenge.challenge);
    expect(solution.salt).toBe(challenge.salt);
    expect(solution.signature).toBe(challenge.signature);
  });

  it("rend compte de son avancement", async () => {
    const ratios: number[] = [];
    await solveChallenge(buildChallenge(4_500), (ratio) => ratios.push(ratio));

    expect(ratios.length).toBeGreaterThan(1);
    expect(ratios[ratios.length - 1]).toBe(1);
  });

  it("échoue plutôt que de boucler quand le défi est insoluble", async () => {
    const challenge = { ...buildChallenge(10), challenge: "0".repeat(64) };

    await expect(solveChallenge(challenge)).rejects.toThrow(
      /anti-robot/,
    );
  });
});
