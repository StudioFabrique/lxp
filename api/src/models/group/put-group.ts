import Group, { IGroup } from "../../utils/interfaces/db/group";

export default async function putGroup(
  group: IGroup,
  image: Buffer | undefined
) {
  const groupToFind = await Group.findOne({ _id: group._id });
  if (!groupToFind) {
    return null;
  }

  if (!!image) {
    group.image = image;
  }

  const createdGroup = await Group.updateOne({ _id: group._id }, group);

  if (!createdGroup) {
    return null;
  }

  return createdGroup;
}
