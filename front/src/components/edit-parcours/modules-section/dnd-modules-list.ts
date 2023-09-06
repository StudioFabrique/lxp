import Module from "../../../utils/interfaces/module";
import Column from "./column";

export default interface DndModulesList {
  tasks: Array<Module>;
  columns: { [key: string]: Column };
}
