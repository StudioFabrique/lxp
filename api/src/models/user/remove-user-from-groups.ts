import Group from "../../utils/interfaces/db/group.ts";

type GroupRepository = {
  updateMany: (filter: object, update: object) => Promise<unknown>;
};

const groupRepository: GroupRepository = {
  updateMany: (filter, update) => Group.updateMany(filter, update),
};

/** Retire d'un seul coup toutes les références MongoDB vers un utilisateur. */
export default async function removeUserFromGroups(
  userId: unknown,
  repository: GroupRepository = groupRepository,
) {
  await repository.updateMany(
    { users: userId },
    { $pull: { users: userId } },
  );
}
