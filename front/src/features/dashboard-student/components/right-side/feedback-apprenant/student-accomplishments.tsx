import { useQuery } from "@tanstack/react-query";
import { dashboardStudentApi } from "../../../api/dashboard-student.api";
import Item from "./item";
import { Accomplishment } from "../../../interfaces/accomplishment";
import Loader from "../../../../../components/loaders/Loader";
import BoxWrapper from "../../../../../components/wrappers/BoxWrapper";

const StudentAccomplishments = () => {
  const { data: accomplishments, isLoading } = useQuery({
    queryKey: ["accomplishments"],
    queryFn: dashboardStudentApi.queries.getAccomplishments,
    select: (data) => data.data as Accomplishment[],
  });

  return (
    <BoxWrapper className="h-87.5 items-center gap-5">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        {isLoading ? (
          <Loader />
        ) : accomplishments && accomplishments?.length > 0 ? (
          accomplishments.map((item) => (
            <Item key={item.id} accomplishment={item} onRemove={() => {}} />
          ))
        ) : (
          <p>Aucun feedback</p>
        )}
      </div>
    </BoxWrapper>
  );
};

export default StudentAccomplishments;
