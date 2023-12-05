import { FC, FormEvent, FormEventHandler, useEffect } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useForm from "../../UI/forms/hooks/use-form";
import Field from "../../UI/forms/field";
import { infoSchema } from "../../../lib/validation/profile/info-schema";
import toast from "react-hot-toast";
import { validationErrors } from "../../../helpers/validate";

const Info: FC<{ userInfo: Record<string, string | undefined> }> = ({
  userInfo,
}) => {
  const { initValues, onValidationErrors, ...formProps } = useForm();

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log({ donneesDuFormulaire: formProps });

    try {
      infoSchema.parse(formProps.values);
      toast.success("Formulaire envoyé avec succès !");
    } catch (error) {
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
      return;
    }
  };

  useEffect(() => {
    initValues(userInfo);
  }, [initValues, userInfo]);

  return (
    <div>
      <h3 className="text-lg font-semibold">Information</h3>
      <Wrapper>
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          <Field name="firstName" label="Prénom" data={formProps} />
          <Field name="lastName" label="Nom" data={formProps} />
          <Field name="nickname" label="Pseudo" data={formProps} />
          <button type="submit" className="btn btn-primary">
            test
          </button>
        </form>
      </Wrapper>
    </div>
  );
};

export default Info;
