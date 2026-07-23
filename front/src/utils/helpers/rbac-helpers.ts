/**
 * Cette fonction permet de vérifier si une permission spécifique existe dans un tableau de permissions.
 * Elle combine une action et un objet pour former une chaîne de permission à vérifier.
 *
 * @param permissions - Le tableau des permissions à vérifier
 * @param action - L'action à vérifier (ex: 'read', 'write', etc)
 * @param object - L'objet sur lequel s'applique l'action
 * @returns {boolean} True si la permission existe, False sinon
 */
function hasPermission(
  permissions: string[],
  action: string,
  object: string,
): boolean {
  const permissionToCheck = `${action}:${object}`;
  return permissions.includes(permissionToCheck);
}

export { hasPermission };
