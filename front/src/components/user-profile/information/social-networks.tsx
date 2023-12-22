import { FC } from "react";
import { Link } from "../../../utils/interfaces/link";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";

const SocialNetworks: FC<{ links: Link[]; editMode: boolean }> = ({
  links,
  editMode,
}) => {
  const handleOpenLinkNewTab = (link: string) => {
    if (editMode) return;
    window.open(link);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
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
                      <span className="w-5 h-5 cursor-pointer">
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
