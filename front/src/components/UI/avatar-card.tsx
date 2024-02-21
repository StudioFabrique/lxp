import { localeTime } from "../../helpers/locale-date";
import FeelingLevel from "./feeling-level";
import Wrapper from "./wrapper/wrapper.component";

interface AvatarCardProps {
  avatarSrc: string;
  username: string;
  message: string;
  feelingLevel: number;
  feedbackAt: string;
}

export default function AvatarCard({
  avatarSrc,
  username,
  message,
  feelingLevel,
  feedbackAt,
}: AvatarCardProps) {
  return (
    <Wrapper>
      <span className="text-xs flex items-start gap-x-4">
        <div className="avatar">
          <div className="w-12 mask mask-squircle">
            <img src={avatarSrc} />
          </div>
        </div>
        <div className="h-5/6 flex-1 flex flex-col gap-y-2">
          <h2 className="font-bold capitalize">
            {username}{" "}
            <p className="lowercase font-normal text-xs">
              à {localeTime(feedbackAt)}
            </p>
          </h2>
          <span className="flex items-center justify-between">
            <p className="text-sm">{message}</p>
          </span>
        </div>
        <div className="h-full flex items-center">
          <FeelingLevel value={feelingLevel} />
        </div>
      </span>
    </Wrapper>
  );
}
