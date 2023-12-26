import { ChangeEvent, FC, Ref, useRef, useState } from "react";
import { Link } from "../../../utils/interfaces/link";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import Can from "../../UI/can/can.component";
import useHttp from "../../../hooks/use-http";

const SocialNetworks: FC<{ links: Link[]; editMode: boolean }> = ({
  links,
  editMode,
}) => {
  const { sendRequest, isLoading } = useHttp(true);
  const modalRef: Ref<HTMLDialogElement> = useRef(null);

  const [value, setValue] = useState<string>("");

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleOpenLinkNewTab = (link: string) => {
    if (editMode) return;
    window.open(link);
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
        <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
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
        <div
          className={`flex flex-wrap ${
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
                      <span className="w-6 h-6 cursor-pointer">
                        <DeleteIcon />
                      </span>
                    </>
                  )}
                </div>
              ))
            : "Aucuns réseaux sociaux"}
        </div>
      </Wrapper>
    </div>
  );
};

export default SocialNetworks;
