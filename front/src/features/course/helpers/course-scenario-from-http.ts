import { sortArray } from "../../../utils/helpers/sort-array";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function courseScenarioFromHttp(data: any) {
  const updatedData: any = {
    lessons: sortArray(data.lessons, "order"),
    scenario: data.scenario,
  };
  return updatedData;
}
