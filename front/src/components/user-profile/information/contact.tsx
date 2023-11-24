import { FC, FormEvent, FormEventHandler, useEffect } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import useForm from "../../UI/forms/hooks/use-form";

const Contact: FC<{ userContact: Record<string, string | undefined> }> = ({
  userContact,
}) => {
  const { initValues, /* onValidationErrors, */ ...formProps } = useForm();

  const handleSubmitForm: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log({ donneesDuFormulaire: formProps });

    /* try {
      infoSchema.parse(formProps.values);
      toast.success("Formulaire envoyé avec succès !");
    } catch (error) {
      const newErrors = validationErrors(error);
      toast.error(newErrors[0].message);
      onValidationErrors(newErrors);
      return;
    } */
  };

  useEffect(() => {
    initValues(userContact);
  }, [initValues, userContact]);

  return (
    <div>
      <h3 className="text-lg font-semibold">Contacts</h3>
      <Wrapper>
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          <Field name="address" label="Adresse" data={formProps} />
          <Field name="lastName" label="Nom" data={formProps} />
          <button type="submit" className="btn btn-primary">
            test
          </button>
        </form>
      </Wrapper>
    </div>
  );
};

export default Contact;
