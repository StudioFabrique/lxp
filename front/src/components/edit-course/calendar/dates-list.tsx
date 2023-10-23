import CourseDates from "../../../utils/interfaces/course-dates";
import DatesItem from "./dates-item";

interface DatesListProps {
  datesList: CourseDates[];
}

const DatesList = (props: DatesListProps) => {
  const { datesList } = props;

  return (
    <>
      {datesList && datesList.length > 0 ? (
        <ul>
          {datesList.map((date) => (
            <li key={date.id}>
              <DatesItem dateItem={date} onSubmitDates={() => {}} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default DatesList;
