/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  FC,
  FormEvent,
  FormEventHandler,
  Reducer,
  Ref,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Hobby from "../../../utils/interfaces/hobby";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import Loader from "../../UI/loader";
import Can from "../../UI/can/can.component";
import { Context } from "../../../store/context.store";
import { Delete, Edit, PlusCircle } from "lucide-react";

enum ActionType {
  add,
  edit,
  delete,
}

type PayloadType = {
  id?: string;
  newHobby?: Hobby;
};

const reducer: Reducer<Hobby[], { type: ActionType; payload: PayloadType }> = (
  hobbies,
  { type, payload }
) => {
  switch (type) {
    case ActionType.add: {
      const { newHobby } = payload;

      if (!newHobby) throw Error(`Incorrect payload: ${payload}`);
      return [...hobbies, newHobby];
    }
    case ActionType.edit: {
      const { id, newHobby } = payload;
      if (!newHobby) throw Error(`Incorrect payload: ${payload}`);
      return hobbies.map((hobby) => (hobby._id === id ? newHobby : hobby));
    }
    case ActionType.delete: {
      const { id } = payload;
      return hobbies.filter((hobby) => id !== hobby._id);
    }
    default:
      throw Error(`Unknown action: ${type}`);
  }
};

const Hobbies: FC<{ initHobbies: Hobby[]; editMode: boolean }> = ({
  initHobbies,
  editMode,
}) => {
  const { user } = useContext(Context);
  const { sendRequest, isLoading } = useHttp(true);

  const modalRef: Ref<HTMLDialogElement> = useRef(null);
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const [value, setValue] = useState<string>("");
  const [hobbies, dispatch] = useReducer(reducer, initHobbies);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleAddHobby: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log("test");

    const applyData = (data: any) => {
      const hobby = data.data;
      dispatch({
        type: ActionType.add,
        payload: {
          newHobby: {
            _id: hobby._id,
            title: hobby.title,
            user: user ?? undefined,
          },
        },
      });
      toast.success("Centre d'intérêt ajouté avec succès");
    };

    sendRequest(
      {
        path: `/user/hobby`,
        body: { title: value, id: user?._id },
        method: "post",
      },
      applyData
    );
  };

  const handleDeleteHobby = (id: string) => {
    const applyData = () => {
      dispatch({ type: ActionType.delete, payload: { id: id } });
      toast.success("Centre d'intérêt supprimé avec succès");
    };

    sendRequest({ path: `/user/hobby/${id}`, method: "delete" }, applyData);
  };

  const handleShowModal = () => {
    modalRef.current?.showModal();
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      <dialog ref={modalRef} className="modal">
        <div className="modal-box flex flex-col gap-10">
          <form
            onSubmit={handleAddHobby}
            className="flex justify-between items-center"
          >
            <input
              type="text"
              className="input input-secondary"
              value={value}
              onChange={handleChangeValue}
            />
            <button type="submit" className="btn">
              Ajouter
            </button>
          </form>
        </div>
      </dialog>
      <div className="flex gap-5">
        <h3 className="text-lg font-semibold">Mes centres d'intérêts</h3>
        {editMode && (
          <Can action="write" object="profile">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleShowModal}
            >
              Ajouter <PlusCircle className="h-5" />
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
                        <span className="flex items-center">
                          <Can action="update" object="profile">
                            <Edit className="h-5 cursor-pointer" />
                          </Can>
                          <Can action="delete" object="profile">
                            <Delete
                              className="h-5 cursor-pointer"
                              onClick={() => handleDeleteHobby(hobby._id!)}
                            />
                          </Can>
                        </span>
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
