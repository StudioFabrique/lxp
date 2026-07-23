import jwt from "jsonwebtoken";
import User from "../../interfaces/db/user";
import { IRole } from "../../interfaces/db/role";
import {
  AppAbility,
  AppAbilityRule,
  buildAbility,
} from "../../rbac/ability";
import { isTokenBlacklisted } from "./set-tokens";

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

export async function authenticateSession(
  token: unknown,
  expectedType: SessionTokenType = "access",
): Promise<AuthenticatedSession> {
  if (
    !token ||
    typeof token !== "string" ||
    (await isTokenBlacklisted(token))
  ) {
    throw new AuthenticationError("Session absente ou expirée");
  }

  let payload: SessionPayload;
  try {
    payload = jwt.verify(token, process.env.SECRET!) as SessionPayload;
  } catch {
    throw new AuthenticationError("Session absente ou expirée");
  }

  // tokenType is optional only during the compatible rollout of pre-CASL JWTs.
  if (
    !payload.userId ||
    (payload.tokenType !== undefined && payload.tokenType !== expectedType)
  ) {
    throw new AuthenticationError("Type de session invalide");
  }

  const user = await User.findById(payload.userId).populate({
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

