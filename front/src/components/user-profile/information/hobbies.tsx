import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Hobby from "../../../utils/interfaces/hobby";

const Hobbies: FC<{ hobbies: Hobby[] }> = ({ hobbies }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Mes passions</h3>
      <Wrapper>
        {hobbies.length > 0
          ? hobbies.map((hobby) => <p key={hobby._id}>{hobby.title}</p>)
          : "Aucunes passions"}
      </Wrapper>
    </div>
  );
};

export default Hobbies;
