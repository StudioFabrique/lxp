import {
  EventHandler,
  FC,
  FormEvent,
  MouseEvent,
  MouseEventHandler,
} from "react";
import { regexGeneric } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";
import Informations from "./components/informations.components";
import Tags from "./components/tags.component";
import Details from "./components/details.component";
import Date from "./components/date.component";
import GroupUserList from "../../lists/group-user-list/group-user-list.component";

const GroupAddForm: FC<{
  group?: any;
  onSubmitForm: (group: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.name ?? ""
  );

  const { value: desc } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.desc ?? ""
  );

  const { value: diplome } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.diplome ?? ""
  );

  const { value: rncp } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.rncp ?? ""
  );

  const { value: promotion } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.promotion ?? ""
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = name.isValid && desc.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      props.onSubmitForm({
        name: name.value.trim(),
        desc: desc.value.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Créer un groupe de formation</h1>
        <span className="flex gap-x-4">
          <button className="btn btn-sm bg-blue-800 text-white">Publier</button>
          <button className="btn btn-sm bg-white">...</button>
        </span>
      </div>
      <p className="mb-5">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna
        eget pura.
      </p>
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-x-5">
        <Informations name={name} diplome={diplome} rncp={rncp} />
        <div className="grid grid-row-2 max-md:mb-2 max-md:mt-2 gap-y-2">
          <Tags />
          <Date />
        </div>
        <Details promotion={promotion} desc={desc} />
      </div>
      <div className="my-10" />
      <GroupUserList />
    </form>
  );
};

export default GroupAddForm;
