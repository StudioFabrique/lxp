import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  MouseEvent,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import Wrapper from "../wrapper/wrapper.component";
import SocialNetworksIconSwitcher from "../svg/social-networks/social-networks-icon-switcher";
import { Link } from "./link";
import DeleteIcon from "../svg/delete-icon.compoenent";
import {
  linkIsValid,
  setUrlWebsiteType,
  tranformLinkIntoAlias,
} from "./link-transform-service";

const Links: FC<{
  links: Array<Link>;
  onSetLinks: Dispatch<SetStateAction<Array<Link>>>;
}> = ({ links, onSetLinks }) => {
  const [currentLink, setCurrentLink] = useState<string>("");

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentLink(event.currentTarget.value);
  };

  const handleAddLink: MouseEventHandler<HTMLButtonElement> = () => {
    if (
      currentLink.length > 0 &&
      links.filter((link) => link.url === currentLink).length === 0 &&
      linkIsValid(currentLink)
    ) {
      const linkType = setUrlWebsiteType(currentLink);
      console.log(`type de liens : ${linkType}`);
      const alias = tranformLinkIntoAlias(currentLink, linkType);
      onSetLinks((links) => [
        ...links,
        { url: currentLink, type: linkType, alias: alias },
      ]);
    }
  };

  const handleDeleteLink = (url: string) => {
    onSetLinks((links) => links.filter((link) => link.url !== url));
  };

  return (
    <Wrapper>
      <h2>Liens</h2>
      <span className="flex justify-between gap-x-5">
        <input
          onChange={handleInputChange}
          type="text"
          className="input input-sm w-full rounded-md"
        />
        <button onClick={handleAddLink} type="button" className="btn btn-sm">
          +
        </button>
      </span>
      <ul className="carousel carousel-vertical h-56">
        {links.map((link) => (
          <Item key={link.url} link={link} onClickDelete={handleDeleteLink} />
        ))}
      </ul>
    </Wrapper>
  );
};

const Item: FC<{
  link: Link;
  onClickDelete: (url: string) => void;
}> = ({ link, onClickDelete }) => {
  const handleClick = () => {
    onClickDelete(link.url);
  };

  return (
    <li className="flex gap-x-5 items-center cursor-pointer hover:bg-slate-600 p-2">
      <div className="flex justify-center items-center bg-secondary h-10 w-10 rounded-lg">
        <SocialNetworksIconSwitcher iconType={link.type} />
      </div>
      <a href={link.url} className="w-full carousel">
        {link.alias ?? link.url}
      </a>
      <button onClick={handleClick} type="button">
        <DeleteIcon />
      </button>
    </li>
  );
};

export default Links;
