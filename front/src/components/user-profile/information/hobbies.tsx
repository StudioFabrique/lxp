import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Hobby from "../../../utils/interfaces/hobby";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";

const Hobbies: FC<{ hobbies: Hobby[]; editMode: boolean }> = ({
  hobbies,
  editMode,
}) => {
  const handleDelete = () => {};

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Mes passions</h3>
      <Wrapper>
        <div className="flex flex-grow gap-2">
          {hobbies.length > 0
            ? hobbies.map((hobby) => (
                <SubWrapper key={hobby._id}>
                  <div className="flex gap-2">
                    <p>{hobby.title}</p>
                    <span
                      className="w-5 h-5 self-end cursor-pointer"
                      onClick={handleDelete}
                    >
                      <DeleteIcon />
                    </span>
                  </div>
                </SubWrapper>
              ))
            : "Aucunes passions"}
        </div>
      </Wrapper>
    </div>
  );
};

export default Hobbies;
