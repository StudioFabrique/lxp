import { useQuery } from "@tanstack/react-query";
import { dashboardStudentApi } from "../../../api/dashboard-student.api";
import Item from "./item";
import { Accomplishment } from "../../../interfaces/accomplishment";
import Loader from "../../../../../components/loaders/Loader";
import BoxWrapper from "../../../../../components/wrappers/BoxWrapper";
import { useState } from "react";

const StudentAccomplishments = () => {
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const { data: accomplishments, isLoading } = useQuery({
    queryKey: ["accomplishments"],
    queryFn: dashboardStudentApi.queries.getAccomplishments,
    select: (data) => data.data as Accomplishment[],
  });
  const visibleAccomplishments = accomplishments?.filter(
    (item) => !removedIds.includes(item.id),
  );

  return (
    <BoxWrapper className="h-87.5 items-center gap-5">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        {isLoading ? (
          <Loader variant="rows" label="Chargement des feedbacks" />
        ) : visibleAccomplishments && visibleAccomplishments.length > 0 ? (
          visibleAccomplishments.map((item) => (
            <Item
              key={item.id}
              accomplishment={item}
              onRemove={(id) => setRemovedIds((current) => [...current, id])}
            />
          ))
        ) : (
          <p>Aucun feedback</p>
        )}
      </div>
    </BoxWrapper>
  );
};

export default StudentAccomplishments;
