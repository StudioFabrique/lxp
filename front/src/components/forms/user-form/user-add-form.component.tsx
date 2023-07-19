import { FC, FormEvent, useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexMail, regexPassword } from "../../../utils/constantes";
import Contact from "./components/contact.component";
import TypeUtilisateur from "./components/type-utilisateur.component";
import Certifications from "./components/certifications.component";
import Presentation from "./components/presentation.component";
import Informations from "./components/informations.component";
import Tag from "../../../utils/interfaces/tag";
import Graduation from "../../../utils/interfaces/graduation";
import Liens from "./components/liens.component";
import CreateUserHeader from "../../create-user-header/create-user-header.component";
import Tags from "../../UI/tags/tags.component";

const UserAddForm: FC<{
  user?: any;
  onSubmitForm: (user: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const { value: email } = useInput(
    (value: string) => regexMail.test(value),
    props.user?.email ?? ""
  );

  const { value: password } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.password ?? ""
  );

  const { value: firstname } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.firstname ?? ""
  );

  const { value: lastname } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.lastname ?? ""
  );

  const { value: pseudo } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.pseudo ?? ""
  );

  const { value: address } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.address ?? ""
  );

  const { value: phone } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.phone ?? ""
  );

  const { value: postCode } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.postCode ?? ""
  );

  const { value: city } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.city ?? ""
  );

  const { value: description } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.description ?? ""
  );

  const handleSubmitGraduations = (graduations: Array<Graduation>) => {};

  const handleSubmitTags = (tags: Tag[]) => {};

  const handleSubmitLinks = (links: Array<String>) => {};
  const handleSubmitTypeUtilisateur = (type: number) => {};

  const onChangeDate = () => {};

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      props.onSubmitForm({
        email: email.value.trim(),
        password: password.value.trim(),
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        pseudo: pseudo.value.trim(),
        address: address.value.trim(),
        postCode: postCode.value.trim(),
        city: city.value.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <CreateUserHeader />
      <div className="grid grid-rows-2 gap-y-5">
        <div className="grid grid-cols-3 gap-x-5">
          <Informations
            lastname={lastname}
            firstname={firstname}
            email={email}
            pseudo={pseudo}
          />
          <Contact
            address={address}
            city={city}
            onChangeDate={onChangeDate}
            phone={phone}
            postCode={postCode}
          />
          <div className="grid grid-rows-2 gap-y-5">
            <TypeUtilisateur onSubmit={handleSubmitTypeUtilisateur} />
            <Tags title="Centre d'intérêts" onSubmitTags={handleSubmitTags} />
          </div>
        </div>
        <div>
          <Presentation description={description} />
        </div>
        <div className="grid grid-cols-3 gap-x-5">
          <div className="col-span-2">
            <Certifications onSubmitGraduations={handleSubmitGraduations} />
          </div>

          <Liens onSubmit={handleSubmitLinks} />
        </div>
      </div>
    </form>
  );
};

export default UserAddForm;
