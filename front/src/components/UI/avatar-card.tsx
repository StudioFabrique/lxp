import Wrapper from "./wrapper/wrapper.component";

interface AvatarCardProps {
  avatarSrc: string;
  username: string;
  message: string;
}

export default function AvatarCard({
  avatarSrc,
  username,
  message,
}: AvatarCardProps) {
  return (
    <Wrapper>
      <span className="text-xs flex gap-x-2">
        <div className="avatar">
          <div className="w-12 mask mask-squircle">
            <img src={avatarSrc} />
          </div>
        </div>
        <div className="h-5/6 flex-1 flex flex-col justify-between">
          <h2 className="font-bold">{username}</h2>
          <p>{message}</p>
        </div>
      </span>
    </Wrapper>
  );
}
