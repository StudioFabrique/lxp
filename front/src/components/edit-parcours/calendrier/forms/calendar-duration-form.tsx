/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import useProgressBar from "../../../../hooks/use-progress-bar";
import Module from "../../../../utils/interfaces/module";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../../hooks/use-http";
import ProgressBarWrapper from "../../../UI/progress-bar-wrapper/progress-bar-wrapper";

const CalendarDurationForm = () => {
  const [duration, setDuration] = useState(0);

  const progressBar = useProgressBar(duration > 0);

  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule,
  );

  const initDuration = useCallback(() => {
    if (currentModule) {
      setDuration(currentModule.duration ?? 0);
    }
  }, [currentModule]);

  const handleChangeDurationValue: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(event.currentTarget.value);
    setDuration(value);
    progressBar.handlePrepareRequest(value);
  };

  const handleSubmit = useCallback(() => {
    progressBar.setFetchResultType("loading");

    const applyData = () => {
      dispatch(
        parcoursModulesSliceActions.updateParcoursModule({
          moduleId: currentModule.id,
          module: { ...currentModule, duration: duration },
        }),
      );
      progressBar.setFetchResultType("success");
    };

    sendRequest(
      {
        path: "/modules/calendar/duration",
        method: "put",
        body: { id: currentModule.id, duration: duration },
      },
      applyData,
    );

    progressBar.handleStopRequest();
  }, [currentModule, dispatch, duration, progressBar, sendRequest]);

  useEffect(() => {
    initDuration();
  }, [initDuration]);

  useEffect(() => {
    if (progressBar.canSendRequestNow) {
      handleSubmit();
    }
  }, [progressBar.canSendRequestNow, handleSubmit]);

  return (
    <ProgressBarWrapper loader={progressBar.loader}>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <span className="flex gap-x-2">
            <h3>Durée du module</h3>
            {progressBar.componentFetchType()}
          </span>
          <div className="flex gap-x-5">
            <span className="flex gap-x-2 items-center">
              <input
                onChange={handleChangeDurationValue}
                value={duration}
                type="number"
                placeholder="Nombre d'heures"
                className="input input-sm sm:w-20 md:w-24 lg:w-40"
              />
              <p>H</p>
            </span>
          </div>
        </form>
      )}
    </ProgressBarWrapper>
  );
};

export default CalendarDurationForm;
