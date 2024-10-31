import { ACTIVITIES } from "../../../../config/urls";
import Wrapper from "../../../UI/wrapper/wrapper.component";

type Props = {
  title: string;
  description: string;
  url: string;
};

export default function ImageActivityPreview({
  title,
  description,
  url,
}: Props) {
  return (
    <Wrapper>
      <h2>{title}</h2>
      <img src={`${ACTIVITIES}images/${url}`} />
      <h3>{description}</h3>
    </Wrapper>
  );
}
