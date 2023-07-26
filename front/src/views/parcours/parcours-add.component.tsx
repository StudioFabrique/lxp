import ParcoursHeader from "../../components/parcours-header/parcours-header.component";
import MemoizedParcoursInformations from "../../components/parcours-informations/parcours-informations.component";
import Skills from "../../components/skills/skills.component";
import CanAccessPage from "../../components/UI/can/can-access-page.component";
import ImageHeader from "../../components/UI/image-header/image-header.component";
import Stepper from "../../components/UI/stepper.component/stepper.component";
import { stepsParcours } from "../../config/steps/steps-parcours";
import useSteps from "../../hooks/use-steps";

const ParcoursAdd = () => {
  const { actualStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours);

  return (
    <CanAccessPage action="write" subject="parcours">
      <div className="w-full flex min-h-screen flex-col items-center px-4 py-8 gap-8">
        <ImageHeader />
        <Stepper
          actualStep={actualStep}
          stepsList={stepsList}
          updateStep={updateStep}
        />
        <ParcoursHeader />
        {actualStep.id === 1 ? (
          <MemoizedParcoursInformations validateStep={validateStep} />
        ) : null}
        {actualStep.id === 2 ? <Skills /> : null}
      </div>
    </CanAccessPage>
  );
};

export default ParcoursAdd;
