import { FC, useCallback } from "react";

import ParcoursInformationsForm from "./parcours-informations-form";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../hooks/use-http";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import Wrapper from "../UI/wrapper/wrapper.component";
import DatesSelecter from "../UI/dates-selecter/dates-selecter.component";

type Props = {
  parcoursId?: string;
};

const ParcoursInformations: FC<Props> = ({ parcoursId = "1" }) => {
  const parcoursStartDate = useSelector(
    (state: any) => state.parcoursInformations.infos.startDate
  );
  const parcoursEndDate = useSelector(
    (state: any) => state.parcoursInformations.infos.endDate
  );
  const dispatch = useDispatch();
  const { sendRequest } = useHttp();

  const updateDates = useCallback(
    (startDate: string, endDate: string) => {
      const processData = (data: { success: boolean; message: string }) => {
        console.log({ data });
      };
      sendRequest(
        {
          path: "/parcours/update-dates",
          method: "put",
          body: { parcoursId, startDate, endDate },
        },
        processData
      );
    },
    [parcoursId, sendRequest]
  );

  // Callback pour soumettre les dates du parcours
  const submitDates = useCallback(
    (dates: { startDate: string; endDate: string }) => {
      dispatch(parcoursInformationsAction.updateParcoursDates(dates));
      updateDates(dates.startDate, dates.endDate);
    },
    [updateDates, dispatch]
  );

  console.log({ parcoursStartDate, parcoursEndDate });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mt-16 mb-8">Informations</h2>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16">
        <Wrapper>
          <div className="flex flex-col gap-y-8">
            <ParcoursInformationsForm parcoursId={parcoursId} />
            <DatesSelecter
              startDateProp={parcoursStartDate}
              endDateProp={parcoursEndDate}
              label="Dates de parcours"
              onSubmitDates={submitDates}
            />
          </div>
        </Wrapper>
        <Wrapper>
          <div className="bg-blue-400" />
        </Wrapper>
      </div>
    </div>
  );
};

export default ParcoursInformations;
