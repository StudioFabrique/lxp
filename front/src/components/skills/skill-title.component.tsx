import { FC } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";

type Props = {
  title: string;
};

const SkillTitle: FC<Props> = ({ title }) => {
  return (
    <div className="flex-1">
      <Wrapper>
        <p>{title}</p>
      </Wrapper>
    </div>
  );
};

export default SkillTitle;
