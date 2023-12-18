import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Hobby from "../../../utils/interfaces/hobby";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

const Hobbies: FC<{ hobbies: Hobby[] }> = ({ hobbies }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Mes passions</h3>
      <Wrapper>
        <div className="flex flex-grow gap-2">
          {hobbies.length > 0
            ? hobbies.map((hobby) => (
                <SubWrapper key={hobby._id}>{hobby.title}</SubWrapper>
              ))
            : "Aucunes passions"}
        </div>
      </Wrapper>
    </div>
  );
};

export default Hobbies;
