import type { Request } from "express";
import type { ParamsFlatDictionary } from "express-serve-static-core";
import { type IRole } from "../db/role.ts";
import { type AppAbility, type AppAbilityRule } from "../../rbac/ability.ts";

export default interface CustomRequest<
  Params = ParamsFlatDictionary,
> extends Request<Params> {
  auth?: {
    userId: string;
    userRoles: Array<IRole>;
    ability: AppAbility;
    abilityRules: AppAbilityRule[];
  };
}
