export const setClasses = (value: boolean) => {
  return value
    ? "w-full outline-none font-normal p-6 bg-red-500/30"
    : "w-full outline-none font-normal p-6 bg-dark/10";
};

/**
 * définit le style du champ formulaire en fonction de sa validité
 * @param hasError boolean
 * @returns string
 */
export const setInputStyle = (hasError: boolean) => {
  return hasError
    ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
    : "input input-sm input-bordered focus:outline-none w-full";
};
