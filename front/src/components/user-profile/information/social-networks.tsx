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
import { Link } from "../../../utils/interfaces/link";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import Can from "../../UI/can/can.component";
import useHttp from "../../../hooks/use-http";
import { EditIcon, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Context } from "../../../store/context.store";

enum ActionType {
  add,
  edit,
  delete,
}

type PayloadType = {
  id?: string;
  newLink?: Link;
};

const reducer: Reducer<Link[], { type: ActionType; payload: PayloadType }> = (
  links,
  { type, payload }
) => {
  switch (type) {
    case ActionType.add: {
      const { newLink } = payload;
      if (!newLink) throw Error(`Incorrect payload: ${payload}`);
      return [...links, newLink];
    }
    case ActionType.edit: {
      const { id, newLink } = payload;
      if (!newLink) throw Error(`Incorrect payload: ${payload}`);
      return links.map((link) => (link._id === id ? newLink : link));
    }
    case ActionType.delete: {
      const { id } = payload;
      return links.filter((link) => id !== link._id);
    }
    default:
      throw Error(`Unknown action: ${type}`);
  }
};

const SocialNetworks: FC<{ initLinks: Link[] }> = ({ initLinks }) => {
  const { user } = useContext(Context);
  const { sendRequest } = useHttp(true);
  const modalRef: Ref<HTMLDialogElement> = useRef(null);

  const [value, setValue] = useState<string>("");
  const [links, dispatch] = useReducer(reducer, initLinks);
  const [editMode /* setEditMode */] = useState(false);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleAddLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!value) return;

    const applyData = (data: any) => {
      const link = data.data;
      dispatch({
        type: ActionType.add,
        payload: {
          newLink: {
            _id: link._id,
            url: link.title,
            type: "website",
            user: link ?? undefined,
          },
        },
      });
      toast.success("Lien ajouté avec succès");
    };

    sendRequest(
      {
        path: `/user/link`,
        body: { title: value, id: user?._id },
        method: "post",
      },
      applyData
    );
  };

  /* const handleDeleteLink = (id: string) => {
    const applyData = () => {
      dispatch({ type: ActionType.delete, payload: { id: id } });
      toast.success("Centre d'intérêt supprimé avec succès");
    };

    sendRequest({ path: `/user/hobby/${id}`, method: "delete" }, applyData);
  }; */

  const handleOpenLinkNewTab = (link: string) => {
    if (editMode) return;
    window.open(link);
  };

  const handleShowModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <div data-testid="social-networks" className="flex flex-col gap-2">
      <dialog ref={modalRef} className="modal">
        <div className="modal-box flex flex-col gap-5">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => modalRef.current?.close()}
          >
            ✕
          </button>
          <p>Url du réseau social :</p>
          <div className="flex justify-between items-center">
            <input
              type="text"
              className="input input-secondary"
              value={value}
              onChange={handleChangeValue}
            />
            <button type="button" className="btn" onClick={handleAddLink}>
              Ajouter
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex gap-5">
        <h3 className="text-lg font-semibold">Mes réseaux sociaux</h3>
        <Can action="write" object="cursus">
          <button
            type="button"
            className="btn btn-sm btn-primary text-base-100"
            onClick={handleShowModal}
          >
            Ajouter <PlusCircle className="h-5" />
          </button>
        </Can>
      </div>

      <div
        className={`p-5 flex flex-wrap ${
          editMode ? "flex-col" : "cursor-pointer"
        }  gap-10 `}
      >
        {links.length
          ? links.map((link) => (
              <div
                data-tip={link.url}
                key={link._id}
                onClick={() => handleOpenLinkNewTab(link.url)}
                className={`flex items-center justify-between p-2 rounded-lg  ${
                  editMode
                    ? "bg-secondary/10 p-5 gap-20"
                    : "tooltip hover:bg-secondary/50"
                }`}
              >
                <p>{link.type ?? link.url}</p>
                {editMode && (
                  <>
                    <input
                      type="text"
                      className="input input-sm w-full"
                      value={link.url}
                    />
                    <Can action="update" object="social-network">
                      <EditIcon className="w-6 h-6 cursor-pointer" />
                    </Can>
                    <Can action="delete" object="social-network">
                      <span className="w-6 h-6 cursor-pointer">
                        <DeleteIcon />
                      </span>
                    </Can>
                  </>
                )}
              </div>
            ))
          : "Aucuns réseau social renseigné"}
      </div>
    </div>
  );
};

export default SocialNetworks;
