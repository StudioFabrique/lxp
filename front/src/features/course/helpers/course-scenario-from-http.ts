import { sortArray } from "../../../utils/helpers/sort-array";
import type Lesson from "../../../utils/interfaces/lesson";

export default function courseScenarioFromHttp(data: { lessons: Lesson[]; scenario: boolean }) {
  const updatedData = {
    lessons: sortArray(data.lessons, "order"),
    scenario: data.scenario,
  };
  return updatedData;
}
