/**
 * définit le style du champ input du formulaire en fonction de sa validité
 * @param hasError boolean
 * @returns string
 */
export const setInputStyle = (hasError: boolean) => {
  return hasError
    ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
    : "input input-sm input-bordered focus:outline-none w-full";
};

