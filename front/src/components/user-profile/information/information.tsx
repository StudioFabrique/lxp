import { FC } from "react";
import Contact from "./contact";
import Hobbies from "./hobbies";
import Info from "./info";
import Presentation from "./presentation";
import SocialNetworks from "./social-networks";
import User from "../../../utils/interfaces/user";

const Information: FC<{ userData: User | undefined }> = ({ userData }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-5">
        <Info
          userInfo={{
            firstName: userData?.firstname,
            lastName: userData?.lastname,
            nickname: userData?.nickname,
          }}
        />
        <Contact userContact={{ address: userData?.address }} />
      </div>
      <Presentation />
      <Hobbies />
      <SocialNetworks />
    </div>
  );
};

export default Information;
