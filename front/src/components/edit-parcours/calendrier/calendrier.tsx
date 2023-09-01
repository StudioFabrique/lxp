import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import ModulesListCalendrier from "./modules-list-calendrier";
import CalendrierForm from "./calendrier-form";
import Wrapper from "../../UI/wrapper/wrapper.component";

const Calendrier = () => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const startDate = new Date(parcoursInfos.startDate);
  const endDate = new Date(parcoursInfos.endDate);

  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-2xl">Calendrier</h1>
      <div className="grid grid-cols-3 gap-x-5">
        <ModulesListCalendrier />
        <div className="grid grid-rows-3 gap-y-5 col-span-2">
          <CalendrierForm datesParcours={{ startDate, endDate }} />
          <div className="row-span-2">
            <Wrapper>
              <div></div>
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;
