export type DemoChallenge = {
  algorithm: string;
  challenge: string;
  salt: string;
  signature: string;
  maxnumber: number;
};

export type DemoSolution = {
  challenge: string;
  salt: string;
  number: number;
  signature: string;
};

const encoder = new TextEncoder();

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Retrouve le nombre caché derrière un défi anti-robot.
 *
 * Le serveur a haché `salt + n` pour un `n` qu'il garde ; il faut le retrouver
 * par balayage. Quelques dizaines de milliers de hachages : imperceptible pour
 * un visiteur, multiplié par le nombre de tentatives pour un robot.
 *
 * `onProgress` est appelé par paliers pour alimenter la barre d'avancement, et
 * la boucle rend la main au navigateur à chaque palier afin de ne pas figer
 * l'affichage.
 */
export async function solveChallenge(
  challenge: DemoChallenge,
  onProgress?: (ratio: number) => void,
): Promise<DemoSolution> {
  const STEP = 2_000;

  for (let candidate = 0; candidate <= challenge.maxnumber; candidate++) {
    if ((await sha256Hex(challenge.salt + candidate)) === challenge.challenge) {
      onProgress?.(1);
      return {
        challenge: challenge.challenge,
        salt: challenge.salt,
        number: candidate,
        signature: challenge.signature,
      };
    }

    if (candidate % STEP === 0) {
      onProgress?.(candidate / challenge.maxnumber);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  throw new Error("Vérification anti-robot impossible à résoudre.");
}
