import Module from "../../../utils/interfaces/module";
import Contacts from "./contacts";
import Objectifs from "./objectifs";
import Tags from "./tags";

type ModuleDataProps = { moduleData: Module };

const ModuleData = ({ moduleData }: ModuleDataProps) => (
  <>
    <Objectifs objectives={moduleData.bonusSkills} />
    <div className="grid grid-cols-2 gap-5">
      <Contacts contacts={moduleData.contacts} />
      <Tags tags={moduleData.tags ?? []} />
    </div>
  </>
);

export default ModuleData;
