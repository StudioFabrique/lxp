import { FC } from "react";
import TwitterIcon from "./twitter-icon.component";
import LinkIcon from "./link-icon.component";
import FacebookIcon from "./facebook-icon.component";
import InstagramIcon from "./instagram-icon.component";
import LinkedinIcon from "./linkedin-icon.component";
import YoutubeIcon from "./youtube-icon.component";

const SocialNetworksIconSwitcher: FC<{ iconType: string }> = ({ iconType }) => {
  switch (iconType) {
    default:
      return <></>;
    case "website":
      return <LinkIcon />;
    case "twitter":
      return <TwitterIcon />;
    case "facebook":
      return <FacebookIcon />;
    case "instagram":
      return <InstagramIcon />;
    case "linkedin":
      return <LinkedinIcon />;
    case "youtube":
      return <YoutubeIcon />;
  }
};

export default SocialNetworksIconSwitcher;
