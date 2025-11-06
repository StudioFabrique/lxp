/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  FC,
  MouseEvent,
  Reducer,
  Ref,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import Hobby from "../../../utils/interfaces/hobby";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import Loader from "../../UI/loader";
import Can from "../../UI/can/can.component";
import { PlusCircle, Trash2 } from "lucide-react";
import { Context } from "../../../store/context.store";
import ItemsAdder from "../../UI/items-adder";

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

const Hobbies: FC<{ initHobbies: Hobby[] }> = ({ initHobbies }) => {
  const { user } = useContext(Context);
  const { sendRequest, isLoading } = useHttp(true);

  const modalRef: Ref<HTMLDialogElement> = useRef(null);
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const [value, setValue] = useState<string>("");
  const [hobbies, dispatch] = useReducer(reducer, initHobbies);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleAddHobby = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!value) return;

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
      modalRef.current?.close();
      setValue("");
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
    <div data-testid="hobbies" className="flex flex-col gap-2">
      <ItemsAdder
        styleOptions={{
          label: "Centre d'intérêts",
          placeholder: "Ajouter un nouveau centre d'intérêt",
          itemsHasColor: true,
        }}
        items={hobbies}
        getValue={(item) => item.title}
        onValidate={(value) => {
          if (!(value.length > 0))
            throw new Error("Le centre d'intérêt est vide");
          if (hobbies.some((hobby) => hobby.title === value))
            throw new Error(`Le centre d'intérêt '${value}' existe déjà`);
        }}
        onAddItem={async (value) => {
          dispatch({ type: ActionType.add, payload: {} });
          return true;
        }}
        onDelete={async (item) => {
          setHobbies((hobbies) =>
            hobbies.filter((hobby) => hobby.title !== item.title)
          );
          return true;
        }}
      />
    </div>
  );
};

export default Hobbies;
