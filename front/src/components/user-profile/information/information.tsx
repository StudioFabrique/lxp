import { FC } from "react";
import Contact from "./contact";
import Hobbies from "./hobbies";
import Info from "./info";
import Presentation from "./presentation";
import SocialNetworks from "./social-networks";

const Information: FC<{ userInfo: Record<string, string | undefined> }> = ({
  userInfo,
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-5">
        <Info userInfo={userInfo} />
        <Contact />
      </div>
      <Presentation />
      <Hobbies />
      <SocialNetworks />
    </div>
  );
};

export default Information;
