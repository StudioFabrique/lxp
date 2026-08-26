import { FC } from "react";

type Props = {
  title: string;
};

const SkillTitle: FC<Props> = ({ title }) => {
  return (
    <div className="flex-1 h-16 rounded-lg bg-secondary/10 flex items-center p-2">
      <p className="first-letter:uppercase">{title}</p>
    </div>
  );
};

export default SkillTitle;
