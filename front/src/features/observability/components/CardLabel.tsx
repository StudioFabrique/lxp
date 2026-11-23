/**
 * Libellé de colonne affiché seulement quand `DataTable` passe en cartes
 * (conteneur étroit) : les en-têtes y sont masqués, et une valeur isolée comme
 * « 3 600 ms » ne dirait pas ce qu'elle mesure.
 */
export default function CardLabel({ children }: { children: string }) {
  return (
    <span className="mr-1 hidden text-xs font-normal text-base-content/70 @max-3xl:inline">
      {children} :
    </span>
  );
}
