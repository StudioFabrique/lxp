import { ChangeEvent, FC, Ref, useRef, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Hobby from "../../../utils/interfaces/hobby";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import Loader from "../../UI/loader";
import Can from "../../UI/can/can.component";

const Hobbies: FC<{ hobbies: Hobby[]; editMode: boolean }> = ({
  hobbies,
  editMode,
}) => {
  const { sendRequest, isLoading } = useHttp(true);
  const modalRef: Ref<HTMLDialogElement> = useRef(null);

  const [value, setValue] = useState<string>("");

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleDelete = (id: string) => {
    const applyData = () => {
      toast.success("Centre d'intérêt supprimé avec succès");
    };

    sendRequest({ path: `/user/hobby/${id}`, method: "delete" }, applyData);
  };

  const handleShowModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <div className="flex flex-col gap-2">
      <dialog ref={modalRef} className="modal">
        <div className="modal-box flex flex-col gap-10">
          <span className="flex justify-between">
            <input
              type="text"
              className="input input-secondary"
              value={value}
              onChange={handleChangeValue}
            />
            <button type="button" className="btn">
              Ajouter
            </button>
          </span>
        </div>
      </dialog>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Mes centres d'intérêts</h3>
        {editMode && (
          <Can action="write" object="profile">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleShowModal}
            >
              +
            </button>
          </Can>
        )}
      </div>
      <Wrapper>
        <div className="flex flex-wrap gap-5">
          {hobbies.length > 0
            ? hobbies.map((hobby) => (
                <SubWrapper key={hobby._id}>
                  <div className="flex gap-2">
                    <p>{hobby.title}</p>
                    {editMode &&
                      (isLoading ? (
                        <span className="h-5 w-5">
                          <Loader />
                        </span>
                      ) : (
                        <Can action="delete" object="profile">
                          <span
                            className="w-5 h-5 self-end cursor-pointer"
                            onClick={() => handleDelete(hobby._id!)}
                          >
                            <DeleteIcon />
                          </span>
                        </Can>
                      ))}
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
