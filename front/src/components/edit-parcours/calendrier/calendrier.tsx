import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import { FC } from "react";

const Calendrier: FC<{ dates: { startDate: string; endDate: string } }> = ({
  dates,
}) => {
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModule.modules
  ) as Module[];

  return (
    <Wrapper>
      <div className="grid grid-cols-2">
        <div></div>
        <div className="grid grid-rows-3">
          <div>
            <p>{`Début : ${dates.startDate} Fin : ${dates.endDate}`}</p>
          </div>
          <div className="grid row-span-2"></div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Calendrier;
