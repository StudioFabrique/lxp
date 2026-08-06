import { type Request } from "express";
import { type IRole } from "../db/role.ts";
import {
  type AppAbility,
  type AppAbilityRule,
} from "../../rbac/ability.ts";

export default interface CustomRequest extends Request {
  auth?: {
    userId: string;
    userRoles: Array<IRole>;
    ability: AppAbility;
    abilityRules: AppAbilityRule[];
  };
}
