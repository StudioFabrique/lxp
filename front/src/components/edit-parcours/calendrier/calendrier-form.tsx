import { FC, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import { useSelector } from "react-redux";

const CalendrierForm: FC<{
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ datesParcours }) => {
  const currentModule: Module | null = useSelector(
    (state: any) => state.parcoursModule.currentModule
  );

  const [datesModule, setDatesModule] = useState<{
    minDate: string;
    maxDate: string;
  }>({ minDate: "", maxDate: "" });

  const initDate = () => {
    setDatesModule({
      minDate: currentModule?.minDate
        ? new Date(currentModule?.minDate).toISOString().split("T")[0]
        : "",
      maxDate: currentModule?.minDate
        ? new Date(currentModule?.maxDate ?? "").toISOString().split("T")[0]
        : "",
    });
  };

  const handleSubmitDate = () => {};

  useEffect(() => {
    initDate();
  }, []);

  return (
    <Wrapper>
      <p>{`Début du parcours : ${datesParcours.startDate.toLocaleDateString()} Fin du parcours: ${datesParcours.endDate.toLocaleDateString()}`}</p>
      <p>{datesModule.minDate}</p>
      {currentModule ? (
        <form className="flex flex-col gap-y-5">
          <div className="flex gap-x-5">
            <span>
              <label>Début du module : </label>
              <input
                type="date"
                className="input input-sm"
                value={datesModule.minDate}
              />
            </span>
            <span>
              <label>Fin du module : </label>
              <input
                type="date"
                className="input input-sm"
                value={datesModule.maxDate}
              />
            </span>
          </div>
          <p>{`Nombre d'heures du module : ${currentModule.duration} H`}</p>
          <button type="button" className="btn btn-sm self-end">
            Confirmer les dates
          </button>
        </form>
      ) : (
        <p>Veuillez sélectioner un module</p>
      )}
    </Wrapper>
  );
};

export default CalendrierForm;
