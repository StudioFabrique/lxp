import { useSelector } from "react-redux";
import User from "../../../utils/interfaces/user";
import { AvatarSmall } from "../../UI/avatar/avatar.component";

interface StudentItemProps {
  studentItem: User;
}

const StudentItem = (props: StudentItemProps) => {
  const { avatar, email, lastname, firstname, group, createdAt } =
    props.studentItem;
  const formation = useSelector((state: any) => state.parcours.formation.title);

  console.log("group", group);

  return (
    <>
      <td className="bg-transparent">
        <AvatarSmall url={avatar!} />
      </td>
      <td className="bg-transparent capitalize">{firstname}</td>
      <td className="bg-transparent capitalize">{lastname}</td>
      <td className="bg-transparent">{email}</td>
      <td className="bg-transparent text-center">{formation}</td>
      <td className="bg-transparent text-center">{group?.name ?? "-"}</td>
      <td className="bg-transparent">
        {new Date(createdAt!).toLocaleDateString()}
      </td>
    </>
  );
};

export default StudentItem;
