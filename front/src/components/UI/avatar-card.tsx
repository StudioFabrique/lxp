import { CheckCircle } from "lucide-react";
import { localeTime } from "../../helpers/locale-date";
import FeelingLevel from "./feeling-level";
import Wrapper from "./wrapper/wrapper.component";

interface AvatarCardProps {
  _id: string;
  avatarSrc: string;
  username: string;
  message: string;
  feelingLevel: number;
  feedbackAt: string;
  hasBeenReviewed: boolean;
  studentId: string;
  onReview: (studentId: string, feedbackId: string) => void;
}

export default function AvatarCard({
  _id,
  avatarSrc,
  username,
  message,
  feelingLevel,
  feedbackAt,
  hasBeenReviewed,
  studentId,
  onReview,
}: AvatarCardProps) {
  const handleReview = () => {
    if (!hasBeenReviewed) {
      onReview(studentId, _id);
    }
  };

  return (
    <Wrapper>
      <span className="text-xs flex items-start gap-x-4" onClick={handleReview}>
        <div className="avatar">
          <div className="w-12 mask mask-squircle">
            <img src={avatarSrc} />
          </div>
        </div>
        <div className="h-5/6 flex-1 flex flex-col gap-y-2">
          <h2 className="font-bold capitalize">
            {username}
            <p className="lowercase font-normal text-xs">
              à {localeTime(feedbackAt)}
            </p>
          </h2>
          <span className="flex items-center justify-between">
            <p className="text-sm">{message}</p>
          </span>
        </div>
        <div className="h-full flex items-start gap-x-2">
          <FeelingLevel value={feelingLevel} />
        </div>
      </span>{" "}
      <div className="w-full flex justify-end gap-x-2">
        <button
          className="btn btn-xs btn-primary"
          disabled={hasBeenReviewed}
          onClick={handleReview}
        >
          {hasBeenReviewed ? (
            <span className="flex items-center gap-x-2">
              <p>Reviewed</p>
              <CheckCircle className="w-4 h-4" />
            </span>
          ) : (
            <p>Review</p>
          )}
        </button>
        <button className="btn btn-xs btn-primary">Chat</button>
      </div>
    </Wrapper>
  );
}
