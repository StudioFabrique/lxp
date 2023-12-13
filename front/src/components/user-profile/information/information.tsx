import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
import Contact from "./contact";
import Hobbies from "./hobbies";
import Info from "./info";
import Presentation from "./presentation";
import SocialNetworks from "./social-networks";
import User from "../../../utils/interfaces/user";
import useForm from "../../UI/forms/hooks/use-form";
import { validationErrors } from "../../../helpers/validate";
import toast from "react-hot-toast";
import { informationSchema } from "../../../lib/validation/profile/info-schema";

const Information: FC<{
  userData: User | undefined;
  editMode: boolean;
  requestReady: boolean;
  setRequestReady: Dispatch<SetStateAction<boolean>>;
  sendRequestInTab: any;
}> = ({
  userData,
  editMode,
  requestReady,
  setRequestReady,
  sendRequestInTab,
}) => {
  const {
    initValues,
    onValidationErrors,
    ...formProps /* ...formProps prend le reste des valeurs de useForm non utilisées */
  } = useForm();

  const handleSubmitForm = useCallback(() => {
    const applyData = () => {};

    try {
      informationSchema.parse(formProps.values);
      toast.success("Formulaire envoyé avec succès !");
      setRequestReady(false);
      return;
    } catch (error) {
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
      setRequestReady(false);
      return;
    }
  }, [formProps, onValidationErrors, setRequestReady]);

  useEffect(() => {
    initValues(userData);
  }, [initValues, userData]);

  useEffect(() => {
    if (requestReady) handleSubmitForm();
  }, [requestReady, handleSubmitForm]);

  return (
    <form>
      <div className="grid grid-cols-2 gap-5">
        <Info formProps={formProps} editMode={editMode} />
        <Contact formProps={formProps} editMode={editMode} />
      </div>
      <Presentation formProps={formProps} editMode={editMode} />
      <Hobbies hobbies={userData?.hobbies ?? []} />
      <SocialNetworks links={userData?.links ?? []} />
    </form>
  );
};

export default Information;
