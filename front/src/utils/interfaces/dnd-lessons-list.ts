import Column from "./column";
import Objective from "./objective";

export default interface DndLessonsList {
  tasks: Array<Objective>;
  columns: { [key: string]: Column };
}
