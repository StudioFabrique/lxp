/**
 * définit le style du champ input du formulaire en fonction de sa validité
 * @param hasError boolean
 * @returns string
 */
export const setInputStyle = (hasError: boolean) => {
  return cn("input input-sm input-bordered focus:outline-none w-full min-w-0 max-w-full", hasError && "input-error text-error");
};
import { cn } from "../../../utils/cn";
