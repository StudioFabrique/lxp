import { CourseItem, Item } from "../../views/lesson/add/use-add-lesson";
import Selecter from "../UI/selecter/selecter.component";
import Wrapper from "../UI/wrapper/wrapper.component";

type Props = {
  parcoursList: Item[];
  modulesList: Item[];
  courseList: CourseItem[];
  parcoursId: number | null;
  moduleId: number | null;
  courseId: number | null;
  handleStep: (value: boolean) => void;
  getItem: (id: number | null, list: Item[]) => Item | undefined;
  setParcoursId: (value: number | null) => void;
  setModuleId: (value: number | null) => void;
  setCourseId: (value: number | null) => void;
};

export default function CourseSelecters(props: Props) {
  return (
    <Wrapper>
      <div className="h-full flex flex-col justify-start gap-y-4 mb-8">
        <div className="font-bold">
          Choisissez un parcours, un module et un cours
        </div>
        <div className="flex flex-col gap-y-8">
          <span className="flex flex-col gap-y-2">
            <label htmlFor="parcours">Parcours</label>
            <Selecter
              list={props.parcoursList}
              title="Choisissez un parcours"
              defaultItem={props.getItem(props.parcoursId, props.parcoursList)}
              onSelectItem={props.setParcoursId}
            />
          </span>
          <span className="flex flex-col gap-y-2">
            <label htmlFor="module">Module</label>
            <Selecter
              list={props.modulesList}
              title="Choisisez un module"
              defaultItem={props.getItem(props.moduleId, props.modulesList)}
              onSelectItem={props.setModuleId}
            />
          </span>
          <span className="flex flex-col gap-y-2">
            <label htmlFor="cours">Cours</label>
            <Selecter
              list={props.courseList}
              title="Choisisez un cours"
              defaultItem={props.getItem(props.courseId, props.courseList)}
              onSelectItem={props.setCourseId}
            />
          </span>
        </div>
      </div>

      <div className="w-full flex items-end justify-end mt-12">
        <button
          className="btn btn-primary"
          onClick={() => props.handleStep(true)}
          disabled={!props.courseId}
        >
          Suivant
        </button>
      </div>
    </Wrapper>
  );
}
