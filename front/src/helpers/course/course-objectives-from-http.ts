export default function courseObjectivesFromHttp(data: any) {
  let updatedData = {
    courseObjectives: data.objectives.map((item: any) => item.objective),
    parcoursObjectives: data.module.parcours[0].parcours.objectives,
  };

  return updatedData;
}
