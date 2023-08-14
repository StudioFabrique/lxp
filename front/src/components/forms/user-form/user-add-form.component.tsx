import { FC, FormEvent, useState } from "react";
import useInput from "../../../hooks/use-input";
import {
  regexGeneric,
  regexMail,
  regexNumber,
  regexPassword,
} from "../../../utils/constantes";
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
  const [graduations, setGraduations] = useState<Array<Graduation>>([]);

  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [links, setLinks] = useState<
    Array<{
      url: string;
      type:
        | "website"
        | "twitter"
        | "facebook"
        | "youtube"
        | "instagram"
        | "linkedin";
    }>
  >([]);

  const [typeUtilisateur, setTypeUtilisateur] = useState<number>(0);

  const [tags, setTags] = useState<Array<Tag>>([]);

  const { value: email } = useInput(
    (value: string) => regexMail.test(value),
    props.user?.email ?? ""
  );

  const { value: password } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.password ?? ""
  );

  const { value: firstname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.firstname ?? ""
  );

  const { value: lastname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.lastname ?? ""
  );

  const { value: pseudo } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.pseudo ?? ""
  );

  const { value: address } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.address ?? ""
  );

  const { value: phone } = useInput(
    (value: string) => regexNumber.test(value),
    props.user?.phone ?? ""
  );

  const { value: postCode } = useInput(
    (value: string) => regexNumber.test(value),
    props.user?.postCode ?? ""
  );

  const { value: city } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.city ?? ""
  );

  const { value: description } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.description ?? ""
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const handleSubmitTags = (tags: Array<Tag>) => {
    setTags(tags);
  };

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
        birthDate: birthDate,
        graduations: graduations,
        avatar: file,
        tags: tags,
        typeUtilisateur: typeUtilisateur,
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-y-10"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <CreateUserHeader />
      <div className="flex flex-col gap-y-5">
        <div className="grid grid-cols-3 gap-x-5">
          <Informations
            lastname={lastname}
            firstname={firstname}
            email={email}
            pseudo={pseudo}
            onSetFile={setFile}
          />
          <Contact
            address={address}
            city={city}
            birthDate={birthDate}
            onChangeDate={setBirthDate}
            phone={phone}
            postCode={postCode}
          />
          <div className="grid grid-rows-2 gap-y-5">
            <TypeUtilisateur
              typeUtilisateur={typeUtilisateur}
              onSetTypeUtilisateur={setTypeUtilisateur}
            />
            <Tags title="Centre d'intérêts" onSubmitTags={handleSubmitTags} />
          </div>
        </div>
        <div>
          <Presentation description={description} />
        </div>
        <div className="grid grid-cols-3 gap-x-5">
          <div className="col-span-2">
            <Certifications
              graduations={graduations}
              setGraduations={setGraduations}
            />
          </div>

          <Liens links={links} onSetLinks={setLinks} />
        </div>
      </div>
    </form>
  );
};

export default UserAddForm;
