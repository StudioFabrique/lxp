import CourseDates from "../../../utils/interfaces/course-dates";
import DatesCard from "./dates-card";

interface DatesListProps {
  datesList: CourseDates[];
  onDeleteItem: (id: number) => void;
}

const DatesList = (props: DatesListProps) => {
  const { datesList } = props;

  return (
    <>
      {datesList && datesList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {datesList.map((date) => (
            <li key={date.id}>
              <DatesCard datesItem={date} onDeleteItem={props.onDeleteItem} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default DatesList;
