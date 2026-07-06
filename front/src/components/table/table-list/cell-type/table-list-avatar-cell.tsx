import { AvatarSmall } from "../../../avatar/AvatarSmall";

type TableListAvatarCell = {
  avatar?: string;
};

const TableListAvatarCell = (props: TableListAvatarCell) => {
  return (
    <td className="pl-4 pr-1">
      <div className="flex justify-center items-center h-full">
        {props.avatar ? (
          <AvatarSmall
            user={{
              avatar: `data:image/jpeg;base64,${props.avatar}`,
              firstname: "",
              lastname: "",
            }}
          />
        ) : null}
      </div>
    </td>
  );
};

export default TableListAvatarCell;
