import { useMemo } from "react";
import type Skill from "../../../utils/interfaces/skill";
import { useParcoursQuery } from "./useParcoursQuery";

type SkillRelation = Skill | { skill: Skill };

export function useParcoursSkills(parcoursId: number) {
  const query = useParcoursQuery(parcoursId);
  const skills = useMemo(() => {
    if (!query.data) return [];

    const inherited: Skill[] = (query.data.skills as SkillRelation[]).map(
      (item) => {
        const skill = "skill" in item ? item.skill : item;
        return { ...skill, isBonus: false };
      },
    );
    const bonus: Skill[] = query.data.bonusSkills.map((item) => ({
      ...item,
      isBonus: true,
    }));

    return [
      ...inherited.filter(
        (item) => !bonus.some((bonusSkill) => bonusSkill.description === item.description),
      ),
      ...bonus,
    ];
  }, [query.data]);

  return { ...query, skills };
}
