import { FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import DatesSelecter from "../../../UI/dates-selecter/dates-selecter.component";

const Dates: FC<{
  onSubmitDates: (dates: { startDate: string; endDate: string }) => void;
}> = ({ onSubmitDates }) => (
  <Wrapper>
    <DatesSelecter onSubmitDates={onSubmitDates} />
  </Wrapper>
);

export default Dates;
