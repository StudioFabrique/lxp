/* eslint-disable @typescript-eslint/no-explicit-any */
export default function courseObjectivesFromHttp(data: any) {
  const updatedData = {
    courseObjectives: data.objectives.map((item: any) => item.objective),
    parcoursObjectives: data.module.parcours[0].parcours.objectives,
  };
  console.log(
    "LENGTH ",
    updatedData.courseObjectives.length + updatedData.parcoursObjectives.length
  );

  return updatedData;
}
