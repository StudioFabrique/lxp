import Objective from "../../utils/interfaces/objective";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function courseObjectivesFromHttp(data: any) {
  const updatedData = {
    courseObjectives: data.objectives.map(
      (item: any) => item.objective
    ) as Objective[],
    parcoursObjectives: data.module.parcours.objectives as Objective[],
  };

  return updatedData;
}
