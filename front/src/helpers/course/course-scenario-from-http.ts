import Lesson from "../../utils/interfaces/lesson";

export default function courseScenarioFromHttp(data: any) {
  const updatedData = {
    lessons: data.lessons.map((lesson: any) => lesson.lesson),
    scenario: data.scenario,
  };
  return updatedData;
}
