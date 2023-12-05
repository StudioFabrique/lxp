import { FC } from "react";
import Skills from "./skills";
import User from "../../../utils/interfaces/user";

const Awards: FC<{ userData: User | undefined }> = ({ userData }) => {
  return (
    <div className="flex flex-col gap-5">
      <Skills skillData={[]} />
    </div>
  );
};

export default Awards;
