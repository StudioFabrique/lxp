// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function courseScenarioFromHttp(data: any) {
  const updatedData = {
    lessons: data.lessons,
    scenario: data.scenario,
  };
  return updatedData;
}
