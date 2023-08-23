import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { regexUrl } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";
import useHttp from "../../../hooks/use-http";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

const VirtualClass = () => {
  const parcoursId = useSelector((state: any) => state.parcours.id);
  const virtualClassProp = useSelector(
    (state: any) => state.parcoursInformations.virtualClass
  );
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    virtualClassProp
  );
  const dispatch = useDispatch();
  const isInitialRender = useRef(true);
  const { sendRequest } = useHttp();

  const formIsValid = virtualClass.isValid;

  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current && formIsValid) {
      timer = setTimeout(() => {
        const processData = (data: { success: boolean; message: string }) => {
          if (data.success) {
            toast.success(data.message);
          } else {
            toast.error("Le lien vers la class virtuel n'a pas été mis à jour");
          }
          dispatch(
            parcoursInformationsAction.setVirtualClass(virtualClass.value)
          );
        };
        sendRequest(
          {
            path: "/parcours/update-virtual-class",
            method: "put",
            body: { parcoursId, virtualClass: virtualClass.value },
          },
          processData
        );
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [formIsValid, parcoursId, virtualClass.value, dispatch, sendRequest]);

  return (
    <div className="flex items-center gap-x-4 mt-4">
      <label className="font-bold">Classe Virtuelle</label>
      <input
        className="flex-1 input input-sm focus:outline-none"
        id="virtual"
        name="virtual"
        defaultValue={virtualClass.value}
        onChange={virtualClass.valueChangeHandler}
        onBlur={virtualClass.valueBlurHandler}
        placeholder="Lien vers la classe virtuelle"
      />
    </div>
  );
};

export default VirtualClass;
