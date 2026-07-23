import { FC } from "react";
import Skills from "./skills";

const Awards: FC<{}> = () => {
  return (
    <div className="flex flex-col gap-5">
      <Skills skillData={[]} />
    </div>
  );
};

export default Awards;
