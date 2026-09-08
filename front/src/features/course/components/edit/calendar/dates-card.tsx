import { localeDate } from "../../../../../utils/helpers/locale-date";
import CourseDates from "../../../interfaces/course-dates";
import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";

interface DatesCardProps {
  datesItem: CourseDates;
  onDeleteItem: (id: number) => void;
}

const DatesCard = (props: DatesCardProps) => {
  const { datesItem } = props;

  return (
    <article className="text-xs grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BoxWrapper>
        <BoxWrapper>
          <span className="w-full flex justify-between items-center">
            <p>Début</p>
            <p>{localeDate(datesItem.minDate)}</p>
          </span>
        </BoxWrapper>
        <BoxWrapper>
          <span className="w-full flex justify-between items-center">
            <p>Fin</p>
            <p>{localeDate(datesItem.maxDate)}</p>
          </span>
        </BoxWrapper>
      </BoxWrapper>
      <BoxWrapper>
        <button
          className="absolute top-1 right-1 btn btn-xs btn-error btn-circle lowercase"
          onClick={() => props.onDeleteItem(datesItem.id!)}
        >
          x
        </button>
        <BoxWrapper>
          <span className="w-full flex justify-between items-center">
            <p>Synchrone</p>
            <p>{datesItem.synchroneDuration}</p>
          </span>
        </BoxWrapper>
        <BoxWrapper>
          <span className="w-full flex justify-between items-center">
            <p>Asynchrone</p>
            <p>{datesItem.asynchroneDuration}</p>
          </span>
        </BoxWrapper>
      </BoxWrapper>
    </article>
  );
};

export default DatesCard;
