import { FC } from "react";

type Props = {
  title: string;
};

const SkillTitle: FC<Props> = ({ title }) => {
  return (
    <div className="flex min-h-16 min-w-0 flex-1 items-center rounded-lg bg-secondary/10 p-2">
      <p className="min-w-0 wrap-break-word first-letter:uppercase">{title}</p>
    </div>
  );
};

export default SkillTitle;
