import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import setUrlWebsiteType from "../../../../utils/setUrlWebsiteType";
import SocialNetworksIconSwitcher from "../../../UI/svg-icons/social-networks/social-networks-icon-switcher";

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
          <li className="flex gap-x-2 items-center" key={link.url}>
            <div className="flex justify-center items-center bg-secondary h-10 w-14 rounded-lg">
              <SocialNetworksIconSwitcher iconType={link.type} />
            </div>
            <div>
              <p>{link.url}</p>
            </div>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default Liens;
