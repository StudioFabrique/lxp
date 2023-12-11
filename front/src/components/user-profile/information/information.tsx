import { FC, FormEvent, FormEventHandler, useEffect } from "react";
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

const Information: FC<{ userData: User | undefined }> = ({ userData }) => {
  const {
    initValues,
    onValidationErrors,
    ...formProps /* ...formProps prend le reste des valeurs de useForm non utilisées */
  } = useForm();

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log({ donneesDuFormulaire: formProps });

    try {
      informationSchema.parse(formProps.values);
      toast.success("Formulaire envoyé avec succès !");
    } catch (error) {
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
      return;
    }
  };

  useEffect(() => {
    initValues(userData);
  }, [initValues, userData]);

  return (
    <form onSubmit={handleSubmitForm}>
      <div className="grid grid-cols-2 gap-5">
        <Info formProps={formProps} />
        <Contact formProps={formProps} />
      </div>
      <Presentation formProps={formProps} />
      <Hobbies hobbies={userData?.hobbies ?? []} />
      <SocialNetworks links={userData?.links ?? []} />
    </form>
  );
};

export default Information;
