import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type Parcours from "../../../utils/interfaces/parcours";
import type Skill from "../../../utils/interfaces/skill";
import { parcoursApi } from "../api/parcours.api";
import { parcoursKeys, useParcoursQuery } from "./useParcoursQuery";

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

export function useParcoursSkillMutations(parcoursId: number) {
  const queryClient = useQueryClient();
  const updateBonusSkillsCache = (updater: (skills: Skill[]) => Skill[]) => {
    queryClient.setQueryData<Parcours>(parcoursKeys.detail(parcoursId), (current) =>
      current
        ? { ...current, bonusSkills: updater(current.bonusSkills) }
        : current,
    );
  };

  const createSkill = useMutation({
    mutationFn: (skill: Pick<Skill, "description" | "badge">) =>
      parcoursApi.mutations.createBonusSkill({
        parcoursId: String(parcoursId),
        skill,
      }),
    onSuccess: ({ skill }) => {
      updateBonusSkillsCache((skills) => [...skills, skill]);
    },
  });

  const updateSkill = useMutation({
    mutationFn: (skill: Skill) =>
      parcoursApi.mutations.updateBonusSkill({
        skill: {
          id: skill.id!,
          description: skill.description,
          badge: skill.badge,
        },
      }),
    onSuccess: ({ updatedSkill }) => {
      updateBonusSkillsCache((skills) =>
        skills.map((skill) =>
          skill.id === updatedSkill.id ? updatedSkill : skill,
        ),
      );
    },
  });

  const deleteSkill = useMutation({
    mutationFn: parcoursApi.mutations.deleteBonusSkill,
    onSuccess: (_data, skillId) => {
      updateBonusSkillsCache((skills) =>
        skills.filter((skill) => skill.id !== skillId),
      );
    },
  });

  const importSkills = useMutation({
    mutationFn: (skills: { description: string }[]) =>
      parcoursApi.mutations.importSkills({ parcoursId, skills }),
    onSuccess: ({ skills }) => {
      updateBonusSkillsCache(() => skills);
    },
  });

  return { createSkill, updateSkill, deleteSkill, importSkills };
}
