import { FC } from "react";

export const AvatarSmall: FC<{ url: string }> = (props) => (
  <div className="avatar">
    <div className="h-7 rounded-full">
      <img src={props.url} alt="avatar" />
    </div>
  </div>
);
