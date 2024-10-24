import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import Wrapper from "../wrapper/wrapper.component";
import SocialNetworksIconSwitcher from "../svg/social-networks/social-networks-icon-switcher";
import { Link } from "../../../utils/interfaces/link";
import DeleteIcon from "../svg/delete-icon.component";
import { urlIsValid, transformLink } from "./link-transform-service";

const Links: FC<{
  links: Array<Link>;
  onSetLinks: Dispatch<SetStateAction<Array<Link>>>;
  disabled?: boolean;
}> = ({ links, onSetLinks, disabled }) => {
  const [currentLink, setCurrentLink] = useState<string>("");

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentLink(event.currentTarget.value);
  };

  const handleAddLink: MouseEventHandler<HTMLButtonElement> = () => {
    if (
      currentLink.length > 0 &&
      links.filter((link) => link.url === currentLink).length === 0 &&
      urlIsValid(currentLink)
    ) {
      const linkProperties = transformLink(currentLink);
      onSetLinks((links) => [
        ...links,
        {
          url: currentLink,
          ...linkProperties,
        },
      ]);
      setCurrentLink("");
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
          value={currentLink}
          type="text"
          className="input input-sm w-full rounded-md"
          disabled={disabled}
        />
        <button onClick={handleAddLink} type="button" className="btn btn-sm">
          +
        </button>
      </span>
      <ul className="carousel carousel-vertical h-80">
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
    <li className="flex gap-x-5 items-center cursor-pointer hover:bg-slate-100 p-2">
      <div className="flex justify-center items-center bg-secondary/20 h-10 w-10 rounded-lg">
        <SocialNetworksIconSwitcher iconType={link.type} />
      </div>
      <a href={link.url} target="_blank" className="w-full carousel">
        {link.alias ?? link.url}
      </a>
      <button onClick={handleClick} type="button" className="w-6 h-6">
        <DeleteIcon />
      </button>
    </li>
  );
};

export default Links;
