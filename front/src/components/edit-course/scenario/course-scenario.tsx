import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import TypeScenario from "./type-scenario";
import {
  branchingScenario,
  linearScenario,
} from "../../../config/scenario-description";
import { useDispatch } from "react-redux";
import { courseScenarioActions } from "../../../store/redux-toolkit/course/course-scenario";

const CourseScenario = () => {
  const dispatch = useDispatch();
  const scenario = useSelector(
    (state: any) => state.courseScenario.scenario
  ) as boolean;

  const handleChangeScenario = () => {
    dispatch(courseScenarioActions.setScenario(!scenario));
  };

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h1 className="text-3xl font-bold">Scénario</h1>
      <Wrapper>
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">Type de scénario</h2>
          <span className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TypeScenario
              scenario={scenario}
              label="Scénario Linéaire (par défaut)"
              description={linearScenario}
              onChangeScenario={handleChangeScenario}
            />
            <TypeScenario
              scenario={!scenario}
              label="Scénario à embranchements"
              description={branchingScenario}
              onChangeScenario={handleChangeScenario}
            />
          </span>
        </div>
      </Wrapper>
    </div>
  );
};

export default CourseScenario;
