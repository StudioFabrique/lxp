export type TagActor = {
  userId: string;
  isAdmin: boolean;
};

export function tagOwnerFor(actor: TagActor) {
  return actor.isAdmin ? null : actor.userId;
}

export function canManageTag(
  tag: { createdBy: string | null },
  actor: TagActor,
) {
  return actor.isAdmin || tag.createdBy === actor.userId;
}

export const canDeleteTag = canManageTag;

export function canUnassignTag(
  assignment: { addedBy: string | null },
  actor: TagActor,
) {
  return actor.isAdmin || assignment.addedBy === actor.userId;
}

export function assertCanUnassignTags(
  assignments: Array<{ addedBy: string | null }>,
  actor: TagActor,
) {
  if (assignments.some((assignment) => !canUnassignTag(assignment, actor))) {
    throw {
      statusCode: 403,
      message:
        "Vous ne pouvez pas désassigner un tag ajouté par un administrateur ou une autre équipe pédagogique.",
    };
  }
}

export function assertCanManageTags(
  tags: Array<{ createdBy: string | null }>,
  actor: TagActor,
  message: string,
) {
  if (tags.some((tag) => !canManageTag(tag, actor))) {
    throw { statusCode: 403, message };
  }
}

export function assertCanDeleteTags(
  tags: Array<{ createdBy: string | null }>,
  actor: TagActor,
) {
  assertCanManageTags(
    tags,
    actor,
    "Vous ne pouvez supprimer que les tags que vous avez créés.",
  );
}
