//  admin and teacher

import Graduation from "../../features/user/interfaces/graduation";
import Group from "./group";
import Hobby from "../../features/user/interfaces/hobby";
import { Link } from "../../features/user/interfaces/link";
import Role from "./role";
import { AppAbilityRule } from "../../rbac/ability";

export type OnboardingStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped";

export type UserOnboarding = {
  status: OnboardingStatus;
  step: string;
  version: number;
  updatedAt?: string;
};

export default interface User {
  _id: string;
  idMdb?: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  description?: string;
  address?: string;
  postCode?: string;
  city?: string;
  phoneNumber?: string;
  birthDate?: Date;
  roles: Array<Role>;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  invitationSent: boolean;
  invitationSentAt?: string;
  /**
   * Invitation partie mais pas encore remise par le serveur SMTP.
   *
   * Distinct de `invitationSent` à faux, qui signifie « jamais envoyée » :
   * l'envoi étant détaché de la requête de création, les deux situations
   * seraient autrement indiscernables.
   */
  invitationPending?: boolean;
  group?: Group;
  hobbies?: Array<Hobby>;
  links?: Array<Link>;
  graduations?: Array<Graduation>;
  connectionInfos?: Array<{ lastConnection: string; duration: number }>;
  parcours?: string;
  formation?: string;
  abilityRules: AppAbilityRule[];
  promptStats?: Array<{
    _id: string;
    date: string;
    tokensUsed: number;
  }>;
  onboarding?: UserOnboarding;
}

export interface UserSelection extends User {
  isSelected: boolean;
}
