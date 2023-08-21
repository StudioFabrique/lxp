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
import Wrapper from "../../../UI/wrapper/wrapper.component";
import setUrlWebsiteType from "../../../../utils/setUrlWebsiteType";
import SocialNetworksIconSwitcher from "../../../UI/svg/social-networks/social-networks-icon-switcher";
import { filter } from "cypress/types/bluebird";
import { link } from "fs";

const Liens: FC<{
  links: Array<{
    url: string;
    type:
      | "website"
      | "twitter"
      | "facebook"
      | "youtube"
      | "instagram"
      | "linkedin";
  }>;
  onSetLinks: Dispatch<
    SetStateAction<
      Array<{
        url: string;
        type:
          | "website"
          | "twitter"
          | "facebook"
          | "youtube"
          | "instagram"
          | "linkedin";
      }>
    >
  >;
}> = ({ links, onSetLinks }) => {
  const [currentLink, setCurrentLink] = useState<string>("");

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentLink(event.currentTarget.value);
  };

  const handleAddLink: MouseEventHandler<HTMLButtonElement> = () => {
    const websiteType = setUrlWebsiteType(currentLink);
    console.log("type de liens : " + websiteType);
    if (
      currentLink.length > 0 &&
      links.filter((link) => link.url === currentLink).length === 0
    ) {
      onSetLinks((links) => [
        ...links,
        { url: currentLink, type: websiteType },
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
  link: {
    url: string;
    type:
      | "website"
      | "twitter"
      | "facebook"
      | "youtube"
      | "instagram"
      | "linkedin";
  };
  onClickDelete: (url: string) => void;
}> = ({ link, onClickDelete }) => {
  const handleClick = () => {
    onClickDelete(link.url);
  };

  return (
    <li
      onClick={handleClick}
      className="flex gap-x-5 items-center cursor-pointer hover:bg-slate-600 p-2"
    >
      <div className="flex justify-center items-center bg-secondary h-10 w-10 rounded-lg">
        <SocialNetworksIconSwitcher iconType={link.type} />
      </div>
      <p className="w-full carousel">{link.url}</p>
    </li>
  );
};

export default Liens;
