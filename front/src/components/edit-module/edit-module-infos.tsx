import { localeDate } from "../../helpers/locale-date";
import Contact from "../../utils/interfaces/contact";
import Wrapper from "../UI/wrapper/wrapper.component";

interface EditModuleInfosProps {
  minDate: string;
  maxDate: string;
  description: string;
  contacts: Contact[];
}

export default function EditModuleInfos(props: EditModuleInfosProps) {
  return (
    <section className="w-full grid grid-rows-2 gap-4">
      <Wrapper>
        <article className="w-5/6 text-sm flex flex-col justify-start items-start gap-y-2">
          <h2 className="text-lg font-bold text-primary">Informations</h2>
          <span className="w-full flex justify-between items-start">
            <p className="font-bold">Date de début du module :</p>
            <p>{localeDate(props.minDate)}</p>
          </span>
          <span className="w-full flex justify-between items-start">
            <p className="font-bold">Date de fin du module :</p>
            <p>{localeDate(props.maxDate)}</p>
          </span>
        </article>
      </Wrapper>
      <Wrapper>
        <article className="text-sm flex flex-col justify-start items-start gap-y-2">
          <h2 className="text-lg font-bold text-primary">Description</h2>
          <p>{props.description}</p>
        </article>
      </Wrapper>
    </section>
  );
}
