import { FC } from "react";
import User from "../../../../src/utils/interfaces/user";

export const AvatarSmall: FC<{
  user: Partial<User> & { firstname: string; lastname: string };
  className?: string;
  noImgClassName?: string;
  imgClassName?: string;
}> = ({
  user,
  noImgClassName = "text-xs flex justify-center items-center p-4 w-6 h-6 rounded-full bg-accent text-secondary-content",
  imgClassName = "w-8 h-8 rounded-full object-cover",
}) => {
  return (
    <>
      {!user.avatar || user.avatar === undefined || user.avatar === "" ? (
        <p className={noImgClassName}>
          {(user.firstname[0] + user.lastname[0]).trim().toUpperCase()}
        </p>
      ) : (
        <img src={user.avatar} alt="avatar" className={imgClassName} />
      )}
    </>
  );
};
