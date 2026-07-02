import { sortArray } from "../../utils/sortArray";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function courseScenarioFromHttp(data: any) {
  console.log({ data });

  const updatedData = {
    lessons: sortArray(data.lessons, "order"),
    scenario: data.scenario,
  };
  return updatedData;
}
