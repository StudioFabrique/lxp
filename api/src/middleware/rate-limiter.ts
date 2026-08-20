import { type Request, type Response, type NextFunction } from "express";

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetTime) store.delete(key);
  }
}

export function clientIp(req: Request) {
  return (
    req.ip ??
    req.socket.remoteAddress ??
    req.headers["x-forwarded-for"]?.toString() ??
    "unknown"
  );
}

/**
 * @param keyFor Portée du compteur. Par défaut une IP et un chemin, ce qui
 * convient aux endpoints dont l'abus vient d'une seule machine. Pour la
 * connexion, compter par IP seule punirait tout un établissement derrière un
 * même NAT le matin ; la portée y est donc élargie à l'adresse visée.
 */
export default function rateLimiter(
  maxRequests: number,
  windowMs: number,
  keyFor: (req: Request) => string = (req) => `${clientIp(req)}:${req.path}`,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    cleanup();

    const now = Date.now();
    const key = keyFor(req);
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count++;

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({
        message: "Trop de requêtes. Veuillez réessayer plus tard.",
      });
    }

    next();
  };
}
