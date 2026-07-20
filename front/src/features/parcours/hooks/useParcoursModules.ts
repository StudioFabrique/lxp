import { useMemo } from "react";

import type Contact from "../../../utils/interfaces/contact";
import type Module from "../../../utils/interfaces/module";
import type Skill from "../../../utils/interfaces/skill";
import { useParcoursQuery } from "./useParcoursQuery";

type ModuleRelation = Module & {
  module?: Partial<Module>;
  contacts?: Array<Contact | { contact: Contact }>;
  bonusSkills?: Array<Skill | { bonusSkill: Skill }>;
};

export function useParcoursModules(parcoursId: number) {
  const query = useParcoursQuery(parcoursId);
  const modules = useMemo(
    () =>
      ((query.data?.modules ?? []) as ModuleRelation[]).map((item) => ({
        ...item,
        ...item.module,
        contacts: (item.contacts ?? []).map((contact) =>
          "contact" in contact ? contact.contact : contact,
        ),
        bonusSkills: (item.bonusSkills ?? []).map((skill) =>
          "bonusSkill" in skill ? skill.bonusSkill : skill,
        ),
      })) as Module[],
    [query.data?.modules],
  );

  return { ...query, modules };
}
