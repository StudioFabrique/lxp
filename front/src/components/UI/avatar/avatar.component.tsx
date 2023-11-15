import { FC } from "react";

export const AvatarSmall: FC<{ url?: string }> = ({ url = "" }) => {
  if (url === undefined || url.length === 0) {
    const robotIndex = Math.floor(Math.random() * 10) + 1;
    url = `https://robohash.org/${robotIndex}?set=set2&size=24x24`;
  }

  return (
    <div className="avatar">
      <div className="h-7 rounded-full">
        <img src={url} alt="avatar" />
      </div>
    </div>
  );
};
