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
  const firstname = user.firstname?.trim() ?? "";
  const lastname = user.lastname?.trim() ?? "";
  const initials = `${firstname[0] ?? ""}${lastname[0] ?? ""}`
    .trim()
    .toUpperCase();
  const fullName = `${firstname} ${lastname}`.trim() || "Utilisateur supprimé";

  return (
    <>
      {!user.avatar || user.avatar === undefined || user.avatar === "" ? (
        <p className={noImgClassName}>
          {initials || "?"}
        </p>
      ) : (
        <AppImage
          src={user.avatar}
          alt={`Avatar de ${fullName}`}
          className={imgClassName}
        />
      )}
    </>
  );
};
