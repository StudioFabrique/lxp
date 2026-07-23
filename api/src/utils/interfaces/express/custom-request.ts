import { Request } from "express";
import { IRole } from "../db/role";
import {
  AppAbility,
  AppAbilityRule,
} from "../../rbac/ability";

export default interface CustomRequest extends Request {
  auth?: {
    userId: string;
    userRoles: Array<IRole>;
    ability: AppAbility;
    abilityRules: AppAbilityRule[];
  };
}
