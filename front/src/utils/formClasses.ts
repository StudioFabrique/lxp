export const setClasses = (value: boolean) => {
  return value
    ? "w-full outline-none font-normal p-6 bg-red-500/30"
    : "w-full outline-none font-normal p-6 bg-dark/10";
};

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

/**
 * définit le style du champ textarea du formulaire en fonction de sa validité
 * @param hasError boolean
 * @returns string
 */
export const setTextAreaStyle = (hasError: boolean) => {
  return hasError
    ? "textarea textarea-error text-error textarea-sm textarea-bordered focus:outline-none w-full"
    : "textarea textarea-sm focus:outline-none w-full";
};
