import { FC } from "react";

type Props = {
  title: string;
};

const SkillTitle: FC<Props> = ({ title }) => {
  return (
    <div className="flex flex-1">
      <input
        className="w-full input-lg rounded-lg bg-secondary/20 focus:outline-none hover:cursor-default"
        type="text"
        value={title}
        readOnly={true}
      />
    </div>
  );
};

export default SkillTitle;
