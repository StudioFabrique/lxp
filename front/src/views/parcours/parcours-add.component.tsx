import ParcoursHeader from "../../components/parcours-header/parcours-header.component";
import ParcoursForm from "../../components/parcours-form/parcours-form.component";
import Skills from "../../components/skills/skills.component";
import CanAccessPage from "../../components/UI/can/can-access-page.component";
import Stepper from "../../components/UI/stepper.component/stepper.component";
import { stepsParcours } from "../../config/steps/steps-parcours";
import useSteps from "../../hooks/use-steps";

const ParcoursAdd = () => {
  const { actualStep, stepsList, saveStep, updateStep } =
    useSteps(stepsParcours);

  console.log({ stepsList });
  console.log(actualStep.id);

  return (
    <CanAccessPage action="write" subject="parcours">
      <div className="w-full flex h-screen flex-col items-center px-4 py-8 gap-8">
        <Stepper
          actualStep={actualStep}
          stepsList={stepsList}
          updateStep={updateStep}
        />
        <ParcoursHeader />
        {actualStep.id === 1 ? <ParcoursForm saveStep={saveStep} /> : null}
        {actualStep.id === 2 ? <Skills /> : null}
      </div>
    </CanAccessPage>
  );
};

export default ParcoursAdd;
