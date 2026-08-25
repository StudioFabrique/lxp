import jwt from "jsonwebtoken";
import User from "../../interfaces/db/user.ts";
import { type IRole } from "../../interfaces/db/role.ts";
import {
  type AppAbility,
  type AppAbilityRule,
  buildAbility,
} from "../../rbac/ability.ts";
import { isTokenBlacklisted } from "./set-tokens.ts";
import { env } from "../../../config/env.ts";

export type SessionTokenType = "access" | "refresh";

export class AuthenticationError extends Error {
  status = 401 as const;
}

export interface AuthenticatedSession {
  userId: string;
  userRoles: IRole[];
  ability: AppAbility;
  abilityRules: AppAbilityRule[];
}

type SessionPayload = {
  userId?: string;
  tokenType?: SessionTokenType;
};

/**
 * Valide le jeton et rien d'autre : signature, liste noire, type de session.
 *
 * Séparé de `authenticateSession` parce que servir un fichier statique n'a
 * besoin que de savoir qu'une session est ouverte. Charger l'utilisateur, ses
 * rôles et leurs permissions à chaque image d'une leçon coûterait une jointure
 * Mongo par requête, pour une information dont le fichier ne fait rien.
 */
export async function verifySessionToken(
  token: unknown,
  expectedType: SessionTokenType = "access",
): Promise<string> {
  if (
    !token ||
    typeof token !== "string" ||
    (await isTokenBlacklisted(token))
  ) {
    throw new AuthenticationError("Session absente ou expirée");
  }

  let payload: SessionPayload;
  try {
    payload = jwt.verify(token, env.SECRET) as SessionPayload;
  } catch {
    throw new AuthenticationError("Session absente ou expirée");
  }

  if (!payload.userId || payload.tokenType !== expectedType) {
    throw new AuthenticationError("Type de session invalide");
  }

  return payload.userId;
}

export async function authenticateSession(
  token: unknown,
  expectedType: SessionTokenType = "access",
): Promise<AuthenticatedSession> {
  const userId = await verifySessionToken(token, expectedType);

  const user = await User.findById(userId).populate({
    path: "roles",
    populate: { path: "permissions" },
  });

  if (!user || !user.isActive) {
    throw new AuthenticationError("Compte inactif ou introuvable");
  }

  const roles = user.roles as unknown as IRole[];
  const permissionNames = new Set<string>();
  for (const role of roles) {
    for (const permission of (role.permissions || []) as any[]) {
      if (permission?.name) permissionNames.add(permission.name);
    }
  }

  const ability = buildAbility(permissionNames);
  return {
    userId: user._id.toString(),
    userRoles: roles,
    ability,
    abilityRules: ability.rules,
  };
}

