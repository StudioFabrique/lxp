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
import { toast } from "react-hot-toast";

const CalendrierDurationForm = () => {
  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const timer = 5 * 1000;

  const [duration, setDuration] = useState(0);

  const [isReadyToSend, setReadyToSend] = useState(false);

  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();

  const [loader, setLoader] = useState({
    lastTime: Date.now(),
    loadingRate: 0,
  });

  const initDuration = useCallback(() => {
    if (currentModule) {
      setDuration(currentModule.duration);
    }
  }, [currentModule, setDuration]);

  /* const handleChangeSynchrone: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSynchrone(event.currentTarget.id === "radio1" ? true : false);
  }; */

  const handleChangeDuration: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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
      toast.success("durée du module modifié");
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
  }, [duration, handleSubmit, isReadyToSend]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isReadyToSend && duration > 0) {
        handleSubmit();
      }
    }, timer);
    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [loader.lastTime, timer, isReadyToSend, handleSubmit, duration]);

  return (
    <Wrapper>
      <progress
        className="h-1 -m-2 progress progress-primary"
        value={loader.loadingRate}
        max={100}
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
                onChange={handleChangeDuration}
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
