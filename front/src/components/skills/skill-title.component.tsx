import { FC } from "react";

type Props = {
  title: string;
};

const SkillTitle: FC<Props> = ({ title }) => {
  return (
    <div>
      <input
        className="w-full input bg-secondary/20 focus:outline-none hover:cursor-default"
        defaultValue={title}
        readOnly={true}
        type="text"
      />
    </div>
  );
};

export default SkillTitle;
