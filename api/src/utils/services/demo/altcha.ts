import crypto from "node:crypto";

/**
 * Défi anti-robot par preuve de travail, dans l'esprit du protocole Altcha.
 *
 * L'objectif n'est pas d'arrêter un attaquant déterminé mais d'empêcher qu'un
 * robot ouvre des milliers de sessions de démonstration et fasse travailler la
 * base pour rien. Le serveur ne conserve aucun état entre l'émission et la
 * vérification : le défi se relit tout entier depuis sa signature.
 *
 * Écrit ici plutôt qu'emprunté à une dépendance : les deux points sensibles
 * sont la comparaison à temps constant et l'expiration, tous deux couverts par
 * `node:crypto`, et la protection contre le rejeu devait de toute façon être
 * écrite puisqu'aucune bibliothèque ne la fournit.
 */

const ALGORITHM = "SHA-256";

/** Borne de recherche. ~100 000 hachages, soit une fraction de seconde. */
const MAX_NUMBER = 100_000;

/** Au-delà, un défi résolu n'est plus accepté. */
const CHALLENGE_TTL_MS = 5 * 60_000;

export type Challenge = {
  algorithm: string;
  challenge: string;
  salt: string;
  signature: string;
  maxnumber: number;
};

export type Solution = {
  algorithm?: string;
  challenge?: string;
  salt?: string;
  number?: number;
  signature?: string;
};

export class AltchaError extends Error {}

function hmacKey(): string {
  // À défaut de clé dédiée, la clé de session : le défi n'a pas besoin d'un
  // secret distinct, mais en avoir un permet de la faire tourner séparément.
  const key = process.env.ALTCHA_HMAC_KEY || process.env.SECRET;
  if (!key) throw new AltchaError("Aucune clé de signature configurée");
  return key;
}

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

const sign = (value: string) =>
  crypto.createHmac("sha256", hmacKey()).update(value).digest("hex");

/** Comparaison à temps constant, tolérante aux longueurs différentes. */
function matches(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

export function createChallenge(): Challenge {
  const expires = Date.now() + CHALLENGE_TTL_MS;
  const salt = `${crypto.randomBytes(12).toString("hex")}.${expires}`;
  const secret = crypto.randomInt(0, MAX_NUMBER);
  const challenge = sha256(salt + secret);

  return {
    algorithm: ALGORITHM,
    challenge,
    salt,
    signature: sign(challenge),
    maxnumber: MAX_NUMBER,
  };
}

function expiryOf(salt: string): number | null {
  const expires = Number(salt.split(".")[1]);
  return Number.isFinite(expires) ? expires : null;
}

/**
 * Empreintes déjà consommées, pour qu'une solution ne serve qu'une fois.
 *
 * Une `Map` en mémoire, comme le limiteur de débit : correcte tant que l'API
 * tourne dans un seul conteneur, et remise à zéro à chaque redéploiement.
 */
const consumed = new Map<string, number>();

function purgeConsumed(now: number) {
  for (const [signature, expires] of consumed) {
    if (now > expires) consumed.delete(signature);
  }
}

export function verifySolution(solution: Solution): void {
  const { challenge, salt, number, signature } = solution;

  if (
    typeof challenge !== "string" ||
    typeof salt !== "string" ||
    typeof signature !== "string" ||
    typeof number !== "number" ||
    !Number.isInteger(number) ||
    number < 0 ||
    number > MAX_NUMBER
  ) {
    throw new AltchaError("Vérification anti-robot invalide");
  }

  const now = Date.now();
  purgeConsumed(now);

  const expires = expiryOf(salt);
  if (expires === null || now > expires) {
    throw new AltchaError("Vérification anti-robot expirée");
  }

  if (!matches(signature, sign(challenge))) {
    throw new AltchaError("Vérification anti-robot invalide");
  }

  if (!matches(challenge, sha256(salt + number))) {
    throw new AltchaError("Vérification anti-robot invalide");
  }

  if (consumed.has(signature)) {
    throw new AltchaError("Vérification anti-robot déjà utilisée");
  }

  consumed.set(signature, expires);
}
