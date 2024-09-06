import { localeDate } from "../../../helpers/locale-date";
import CourseDates from "../../../utils/interfaces/course-dates";
import Wrapper from "../../UI/wrapper/wrapper.component";

interface DatesCardProps {
  datesItem: CourseDates;
  onDeleteItem: (id: number) => void;
}

const DatesCard = (props: DatesCardProps) => {
  const { datesItem } = props;

  return (
    <article className="text-xs grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Wrapper>
        <Wrapper>
          <span className="w-full flex justify-between items-center">
            <p>Début</p>
            <p>{localeDate(datesItem.minDate)}</p>
          </span>
        </Wrapper>
        <Wrapper>
          <span className="w-full flex justify-between items-center">
            <p>Fin</p>
            <p>{localeDate(datesItem.maxDate)}</p>
          </span>
        </Wrapper>
      </Wrapper>
      <Wrapper>
        <button
          className="absolute top-1 right-1 btn btn-xs btn-error btn-circle lowercase"
          onClick={() => props.onDeleteItem(datesItem.id!)}
        >
          x
        </button>
        <Wrapper>
          <span className="w-full flex justify-between items-center">
            <p>Synchrone</p>
            <p>{datesItem.synchroneDuration}</p>
          </span>
        </Wrapper>
        <Wrapper>
          <span className="w-full flex justify-between items-center">
            <p>Asynchrone</p>
            <p>{datesItem.asynchroneDuration}</p>
          </span>
        </Wrapper>
      </Wrapper>
    </article>
  );
};

export default DatesCard;
