import { GenericActionConfig } from "../interfaces/generic-action";
import GenericItem from "../interfaces/generic-item";

/**
 * Un hook personnalisé pour gérer une table générique
 *
 * @template TData - Le type des données de la table (exemple: Group, User)
 * @param {TData[]} data - Les données à afficher dans la table
 * @param {GenericItem[]} items - Les éléments de configuration de la table
 * @param {GenericAction[]} actions - Les éléments de configurations des actions pour la table
 * @returns labels - Les labels des données dans l'entête du tableau
 * @returns filteredData - Les données filtrées en fonction
 * @returns actions - Les actions dans chaque lignes du tableau avec les données
 *
 */
function useGenericTable<TData>(
  data: TData[],
  items: GenericItem[],
  actionsItems?: GenericActionConfig[],
) {
  return { labels, filteredData, actions };
}

export default useGenericTable;
