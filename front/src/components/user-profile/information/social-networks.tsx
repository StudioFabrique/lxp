import { FC } from "react";
import { Link } from "../../../utils/interfaces/link";
import Wrapper from "../../UI/wrapper/wrapper.component";

const SocialNetworks: FC<{ links: Link[] }> = ({ links }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
      <Wrapper>
        {links.length
          ? links.map((link) => <p>{link.type ?? link.url}</p>)
          : "Aucuns réseaux sociaux"}
      </Wrapper>
    </div>
  );
};

export default SocialNetworks;
