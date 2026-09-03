/**
 * A teacher may create a module from a parcours they are assigned to. Keep the
 * creator assigned to the new module as well, otherwise the module-level access
 * scope immediately prevents them from opening the content they just created.
 */
export function includeCreatorContact(
  selectedContactIds: number[],
  allowedContactIds: Set<number>,
  creatorContactId?: number,
) {
  const contactIds = [...new Set(selectedContactIds)];

  if (
    creatorContactId !== undefined &&
    allowedContactIds.has(creatorContactId) &&
    !contactIds.includes(creatorContactId)
  ) {
    contactIds.push(creatorContactId);
  }

  return contactIds;
}
