
import { localeDate } from "../../utils/helpers/locale-date";
import CourseDates from "../../utils/interfaces/course-dates";
import EditIcon from "../UI/svg/edit-icon";
import BoxWrapper from "../wrappers/BoxWrapper";

interface PreviewCalendarProps {
  dates: CourseDates[];
  onEdit: (id: number) => void;
}

const PreviewCalendar = (props: PreviewCalendarProps) => {
  const { dates } = props;

  return (
    <BoxWrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Calendrier</h2>
        <div className="w-6 h-6 text-primary" onClick={() => props.onEdit(5)}>
          <EditIcon />
        </div>
      </span>
      {dates && dates.length > 0 ? (
        <ul className="flex flex-col gap-y-2">
          {dates.map((date) => (
            <li key={date.id}>
              <div className="w-full text-xs grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BoxWrapper>
                  <BoxWrapper>
                    <span className="w-full flex justify-between items-center">
                      <p>Début</p>
                      <p>{localeDate(date.minDate)}</p>
                    </span>
                  </BoxWrapper>
                  <BoxWrapper>
                    <span className="w-full flex justify-between items-center">
                      <p>Fin</p>
                      <p>{localeDate(date.maxDate)}</p>
                    </span>
                  </BoxWrapper>
                </BoxWrapper>
                <BoxWrapper>
                  <BoxWrapper>
                    <span className="w-full flex justify-between items-center">
                      <p>Synchrone</p>
                      <p>{date.synchroneDuration}</p>
                    </span>
                  </BoxWrapper>
                  <BoxWrapper>
                    <span className="w-full flex justify-between items-center">
                      <p>Asynchrone</p>
                      <p>{date.asynchroneDuration}</p>
                    </span>
                  </BoxWrapper>
                </BoxWrapper>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune date choisie à ce jour</p>
      )}
    </BoxWrapper>
  );
};

export default PreviewCalendar;
