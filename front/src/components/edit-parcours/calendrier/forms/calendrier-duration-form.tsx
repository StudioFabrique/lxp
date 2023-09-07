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

const CalendrierDurationForm = () => {
  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const [duration, setDuration] = useState(0);

  const [synchrone, setSynchrone] = useState(true);

  const [readyToSend, setReadyToSend] = useState(false);

  const initDuration = useCallback(() => {
    if (currentModule) {
      setDuration(currentModule.duration);
    }
  }, [currentModule]);

  const handleChangeDuration: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDuration(parseInt(event.currentTarget.value));
  };

  const handleChangeSynchrone: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSynchrone(event.currentTarget.id === "radio1" ? true : false);
  };

  const handleSubmit = useCallback(() => {
    const applyData = (data: any) => {};

    sendRequest(
      {
        path: "/module/dates",
        method: "put",
        body: {},
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    initDuration();
  }, [initDuration]);

  useEffect(() => {
    if (readyToSend && duration > 0) {
      setInterval(handleSubmit, 5000);
      setReadyToSend(false);
    }
  }, [readyToSend, duration, handleSubmit]);

  return (
    <Wrapper>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <h3>Durée du module</h3>
          <div className="flex gap-x-5">
            <div className="flex flex-col gap-y-2 ">
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
            </div>
            <span className="flex">
              <input
                onChange={handleChangeDuration}
                value={duration}
                type="number"
                placeholder="Nombre d'heures"
                className="input input-sm appearance-none hover:app"
              />
            </span>
          </div>
        </form>
      )}
    </Wrapper>
  );
};

export default CalendrierDurationForm;
