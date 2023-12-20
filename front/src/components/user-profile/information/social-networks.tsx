import { FC } from "react";
import { Link } from "../../../utils/interfaces/link";
import Wrapper from "../../UI/wrapper/wrapper.component";

const SocialNetworks: FC<{ links: Link[]; editMode: boolean }> = ({
  links,
  editMode,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
      <Wrapper>
        {links.length
          ? links.map((link) => <p key={link._id}>{link.type ?? link.url}</p>)
          : "Aucuns réseaux sociaux"}
      </Wrapper>
    </div>
  );
};

export default SocialNetworks;
