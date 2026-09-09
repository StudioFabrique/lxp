import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/loaders/Loader";
import { profileApi } from "../../api/profile.api";
import { profileKeys } from "../../api/profile.keys";
import Skills from "./skills";

const Awards = () => {
  const {
    data: skills = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: profileKeys.skills(),
    queryFn: profileApi.queries.getSkills,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5">
      {isError ? (
        <p role="alert" className="alert alert-error">
          Impossible de charger les badges de compétences.
        </p>
      ) : (
        <Skills skillData={skills} />
      )}
    </div>
  );
};

export default Awards;
