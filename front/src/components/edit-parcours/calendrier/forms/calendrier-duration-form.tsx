import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Module from "../../../../utils/interfaces/module";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../../hooks/use-http";
import { autoSubmitTimer } from "../../../../config/auto-submit-timer";

const CalendrierDurationForm = () => {
  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const [duration, setDuration] = useState(0);

  const [isReadyToSend, setReadyToSend] = useState(false);

  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

  const [loader, setLoader] = useState({
    lastTime: Date.now(),
    loadingRate: 0,
  });

  const [fetchResultType, setFetchResultType] = useState<
    "success" | "error" | "none"
  >("none");

  const initDuration = useCallback(() => {
    if (currentModule) {
      setDuration(currentModule.duration);
    }
  }, [currentModule, setDuration]);

  const handleChangeDurationValue: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFetchResultType("none");
    if (intervalId) clearInterval(intervalId);
    setDuration(parseInt(event.currentTarget.value));
    setReadyToSend(true);
  };

  const handleSubmit = useCallback(() => {
    const applyData = (data: any) => {
      dispatch(
        parcoursModulesSliceActions.updateParcoursModule({
          moduleId: currentModule.id,
          module: { ...currentModule, duration: duration },
        })
      );
      setFetchResultType("success");
    };

    sendRequest(
      {
        path: "/module/duration",
        method: "put",
        body: { id: currentModule.id, duration: duration },
      },
      applyData
    );

    setReadyToSend(false);
  }, [currentModule, dispatch, duration, sendRequest]);

  useEffect(() => {
    initDuration();
  }, [initDuration]);

  useEffect(() => {
    if (isReadyToSend && duration > 0) {
      setLoader({
        lastTime: Date.now(),
        loadingRate: 0,
      });
    }

    /**
     * On fait passer le pourcentage de "loadingRate" à 1.2 si un fetch de la base de données a été
     * effectué afin que la progress bar puisse se remplisse instantanément de 1 à 1.2
     */
    if (fetchResultType === "success" || fetchResultType === "error") {
      setLoader((currentLoader) => {
        return {
          lastTime: currentLoader.lastTime,
          loadingRate: 1.2,
        };
      });
    }
  }, [duration, handleSubmit, isReadyToSend, fetchResultType]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Date.now() - loader.lastTime;
      const loadingRate = timeElapsed / autoSubmitTimer;

      if (isReadyToSend && duration > 0 && timeElapsed > autoSubmitTimer) {
        handleSubmit();
      }

      if (isReadyToSend && duration > 0 && fetchResultType === "none") {
        setLoader((currentLoader) => {
          return {
            lastTime: currentLoader.lastTime,
            loadingRate: loadingRate > 1 ? 1 : loadingRate,
          };
        });
      }
    }, 500);
    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [duration, handleSubmit, isReadyToSend, loader.lastTime, fetchResultType]);

  return (
    <Wrapper>
      <progress
        className="h-1 -m-2 progress progress-primary"
        value={loader.loadingRate}
        max={1.2}
      />
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <h3>Durée du module</h3>
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
    </Wrapper>
  );
};

export default CalendrierDurationForm;
