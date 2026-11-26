import { useQuery } from "@tanstack/react-query";
import ProgressSectionSkeleton from "../progress-section-skeleton";
import { profileApi } from "../../api/profile.api";
import { profileKeys } from "../../api/profile.keys";
import Skills from "./skills";
import type Parcours from "../../../../utils/interfaces/parcours";

type AwardsProps = {
  parcours?: Parcours;
  /** Vrai tant que les parcours se chargent : sans eux, les badges ne peuvent pas être filtrés. */
  isParcoursLoading?: boolean;
};

const Awards = ({ parcours, isParcoursLoading = false }: Readonly<AwardsProps>) => {
  const {
    data: skills = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: profileKeys.skills(),
    queryFn: profileApi.queries.getSkills,
  });

  if (isLoading || isParcoursLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Mes badges de compétences</h3>
        <ProgressSectionSkeleton variant="badges" label="Chargement des badges" />
      </div>
    );
  }

  const moduleIds = new Set(parcours?.modules?.map((module) => module.id) ?? []);
  const parcoursSkills = skills.flatMap((skill) => {
    const modules = skill.modules?.filter((module) => moduleIds.has(module.id)) ?? [];
    return modules.length
      ? [{
          ...skill,
          modules,
          completedModules: modules.filter((module) => module.isCompleted).length,
          totalModules: modules.length,
          isEarned: modules.every((module) => module.isCompleted),
        }]
      : [];
  });

  return (
    <div className="flex flex-col gap-5">
      {isError ? (
        <p role="alert" className="alert alert-error">
          Impossible de charger les badges de compétences.
        </p>
      ) : (
        <Skills skillData={parcoursSkills} />
      )}
    </div>
  );
};

export default Awards;
