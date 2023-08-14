/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ParcoursInformationsForm from "./parcours-informations-form";
import { toast } from "react-hot-toast";
import Contacts from "./contacts";
import VirtualClass from "./virtual-class";
import useHttp from "../../../hooks/use-http";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import Contact from "../../../utils/interfaces/contact";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DatesSelecter from "../../UI/dates-selecter/dates-selecter.component";
import Tags from "../../UI/tags/tags.component";
import Tag from "../../../utils/interfaces/tag";

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
  const tagsIsValid = useSelector(
    (state: any) => state.parcoursInformations.tagsIsValid
  );

  const updateDates = useCallback(
    (startDate: string, endDate: string) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
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

  const updateTags = useCallback(
    (tags: Array<Tag>) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/parcours/update-tags",
          method: "put",
          body: { parcoursId, tags: tags.map((item: Tag) => item.id) },
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

  const submitContacts = useCallback(
    (contacts: Array<Contact>) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/parcours/update-contacts",
          method: "put",
          body: { parcoursId, contacts },
        },
        processData
      );
    },
    [parcoursId, sendRequest]
  );

  useEffect(() => {
    dispatch(parcoursInformationsAction.isValid());
  }, [tagsIsValid, parcoursStartDate, parcoursEndDate, dispatch]);

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16">
        <Wrapper>
          <h2 className="text-xl font-bold">Informations</h2>
          <div className="flex flex-col gap-y-8">
            <ParcoursInformationsForm parcoursId={parcoursId} />
            <DatesSelecter
              startDateProp={parcoursStartDate}
              endDateProp={parcoursEndDate}
              label="Dates de parcours"
              onSubmitDates={submitDates}
            />
          </div>

          <VirtualClass />
        </Wrapper>
        <div className="flex flex-col gap-y-8">
          <Wrapper>
            <Contacts onSubmitContacts={submitContacts} />
          </Wrapper>
          <Wrapper>
            <Tags onSubmitTags={updateTags} />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default ParcoursInformations;
