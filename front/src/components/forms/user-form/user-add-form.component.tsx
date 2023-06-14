import { FC, FormEvent } from "react";
import useInput from "../../../hooks/use-input";
import { regexMail, regexPassword } from "../../../utils/constantes";
import UsersHeader from "../../users-header/users-header.component";
import Contact from "./components/contact.component";
import TypeUtilisateur from "./components/type-utilisateur.component";
import CentreInterets from "./components/centre-interets.component";
import Certifications from "./components/certifications.component";
import Presentation from "./components/presentation.component";
import Informations from "./components/informations.component";

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

  const { value: postCode } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.postCode ?? ""
  );

  const { value: city } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.city ?? ""
  );

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
      <UsersHeader />
      <div className="grid grid-rows-2 gap-y-5">
        <div className="grid grid-cols-3 gap-x-5">
          <Informations
            lastname={lastname}
            firstname={firstname}
            email={email}
            pseudo={pseudo}
          />
          <Contact />
          <div className="grid grid-rows-2 gap-y-5">
            <TypeUtilisateur />
            <CentreInterets />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5">
          <Certifications />
          <Presentation />
        </div>
      </div>
    </form>
  );
};

export default UserAddForm;
