import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import TypeScenario from "./type-scenario";

const CourseScenario = () => {
  const scenario = useSelector(
    (state: any) => state.courseScenario.scenario
  ) as boolean;

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
            />
            <p>tata</p>
          </span>
        </div>
      </Wrapper>
    </div>
  );
};

export default CourseScenario;
