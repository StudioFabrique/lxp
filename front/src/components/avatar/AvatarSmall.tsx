import { FC } from "react";
import User from "../../utils/interfaces/user";
import AppImage from "../UI/image/app-image";

export const AvatarSmall: FC<{
  user: Partial<User> & { firstname: string; lastname: string };
  size?: number;
  noImgClassName?: string;
  imgClassName?: string;
}> = ({
  user,
  size = 8,
  noImgClassName = `w-${size} h-${size} text-xs flex justify-center items-center p-4 rounded-full bg-accent text-secondary-content`,
  imgClassName = `w-${size} h-${size} rounded-full object-cover`,
}) => {
  return (
    <>
      {!user.avatar || user.avatar === undefined || user.avatar === "" ? (
        <p className={noImgClassName}>
          {(user.firstname[0] + user.lastname[0]).trim().toUpperCase()}
        </p>
      ) : (
        <AppImage
          src={user.avatar}
          alt={`Avatar de ${user.firstname} ${user.lastname}`}
          className={imgClassName}
        />
      )}
    </>
  );
};
