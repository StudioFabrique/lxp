import { FC } from "react";

export const AvatarSmall: FC<{ url: string }> = (props) => (
  <div className="avatar">
    <div className="w-10 rounded-full">
      <img src={props.url} alt="avatar" />
    </div>
  </div>
);
