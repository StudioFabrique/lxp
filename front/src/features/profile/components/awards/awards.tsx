import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/loaders/Loader";
import { profileApi } from "../../api/profile.api";
import { profileKeys } from "../../api/profile.keys";
import Skills from "./skills";
import type Parcours from "../../../../utils/interfaces/parcours";

const Awards = ({ parcours }: { parcours?: Parcours }) => {
  const {
    data: skills = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: profileKeys.skills(),
    queryFn: profileApi.queries.getSkills,
  });

  if (isLoading) return <Loader variant="cards" label="Chargement des badges" />;

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
