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

  const formValidation = duration > 0;

  const progressBarProps = useProgressBar(formValidation);

  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const initDuration = useCallback(() => {
    if (currentModule) {
      setDuration(currentModule.duration);
    }
  }, [currentModule, setDuration]);

  const handleChangeDurationValue: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.currentTarget.value);
    setDuration(value);
    progressBarProps.handlePrepareRequest(value);
  };

  const handleSubmit = useCallback(() => {
    progressBarProps.setFetchResultType("loading");

    const applyData = (data: any) => {
      dispatch(
        parcoursModulesSliceActions.updateParcoursModule({
          moduleId: currentModule.id,
          module: { ...currentModule, duration: duration },
        })
      );
      progressBarProps.setFetchResultType("success");
    };

    sendRequest(
      {
        path: "/module/duration",
        method: "put",
        body: { id: currentModule.id, duration: duration },
      },
      applyData
    );

    progressBarProps.handleStopRequest();
  }, [currentModule, dispatch, duration, sendRequest, progressBarProps]);

  useEffect(() => {
    initDuration();
  }, [initDuration]);

  useEffect(() => {
    if (progressBarProps.canSendRequestNow) {
      handleSubmit();
    }
  }, [progressBarProps.canSendRequestNow, handleSubmit]);

  return (
    <ProgressBarWrapper loader={progressBarProps.loader}>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <span className="flex gap-x-2">
            <h3>Durée du module</h3>
            {progressBarProps.componentFetchType()}
          </span>
          <div className="flex gap-x-5">
            {/* Fields asychrone/sychrone */}
            {/* <div className="flex flex-col gap-y-2 ">
              <span className="flex gap-x-2">
                <input
                  id="radio1"
                  name="radio1"
                  type="radio"
                  className="radio"
                  checked={synchrone}
                  onChange={handleChangeSynchrone}
                />
                <label htmlFor="radio1">Synchrone</label>
              </span>
              <span className="flex gap-x-2">
                <input
                  id="radio2"
                  name="radio2"
                  type="radio"
                  className="radio"
                  checked={!synchrone}
                  onChange={handleChangeSynchrone}
                />
                <label htmlFor="radio2">Asynchrone</label>
              </span>
            </div> */}
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
