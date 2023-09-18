import { FC, FormEvent, useState } from "react";
import useInput from "../../../hooks/use-input";
import {
  regexGeneric,
  regexMail,
  regexNumber,
} from "../../../utils/constantes";
import Certifications from "./certifications/certifications";
import Graduation from "../../../utils/interfaces/graduation";
import CreateUserHeader from "../../create-user-header/create-user-header.component";
import Links from "../../UI/links/links";
import { Link } from "../../../utils/interfaces/link";
import Hobby from "../../../utils/interfaces/hobby";
import Informations from "./informations.component";
import Contact from "./contact.component";
import TypeUtilisateur from "./type-utilisateur.component";
import CentreInterets from "./centre-interets.component";
import Presentation from "./presentation.component";

const UserAddForm: FC<{
  user?: any;
  onSubmitForm: (user: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const [graduations, setGraduations] = useState<Array<Graduation>>([]);

  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [links, setLinks] = useState<Array<Link>>([]);

  const [typeUtilisateur, setTypeUtilisateur] = useState<number>(0);

  const [hobbies, setHobbies] = useState<Array<Hobby>>([]);

  const { value: email } = useInput(
    (value: string) => regexMail.test(value),
    props.user?.email ?? ""
  );

  const { value: firstname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.firstname ?? ""
  );

  const { value: lastname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.lastname ?? ""
  );

  const { value: nickname } = useInput(
    (value: string) => regexGeneric.test(value),
    props.user?.nickname ?? ""
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
  formIsValid =
    email.isValid &&
    firstname.isValid &&
    lastname.isValid &&
    (nickname.isValid || nickname.value.length <= 0); /* &&
    (address.isValid || address == null) &&
    (city.isValid || city == null) &&
    (postCode.isValid || postCode) &&
    (phone.isValid || !phone) &&
    (description.isValid || !description); */

  const handleSubmit = () => {
    if (formIsValid) {
      props.onSubmitForm({
        email: email.value.trim(),
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        description: description.value.trim(),
        pseudo: nickname.value.trim(),
        address: address.value.trim(),
        postCode: parseInt(postCode.value.trim()),
        city: city.value.trim(),
        birthDate: birthDate,
        graduations: graduations,
        avatar: file,
        userType: typeUtilisateur,
        links: links,
        hobbies: hobbies,
      });
    }
  };

  return (
    <form className="flex flex-col gap-y-10" autoComplete="off">
      <CreateUserHeader onSubmit={handleSubmit} />
      <div className="flex flex-col gap-y-5">
        <div className="grid grid-cols-3 gap-x-5">
          <Informations
            lastname={lastname}
            firstname={firstname}
            email={email}
            nickname={nickname}
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
          <div className="grid grid-rows-1 gap-y-5">
            <TypeUtilisateur
              typeUtilisateur={typeUtilisateur}
              onSetTypeUtilisateur={setTypeUtilisateur}
            />
            <CentreInterets hobbies={hobbies} setHobbies={setHobbies} />
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
          <Links links={links} onSetLinks={setLinks} />
        </div>
      </div>
    </form>
  );
};

export default UserAddForm;
