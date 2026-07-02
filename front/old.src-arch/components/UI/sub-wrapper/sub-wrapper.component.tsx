import { ReactNode } from "react";

// Interface définissant les props du composant SubWrapper
interface SubWrapperProps {
  hasError?: boolean; // Indique si le wrapper doit afficher un style d'erreur
  children: ReactNode; // Contenu à afficher dans le wrapper
}

/**
 * Composant wrapper secondaire qui peut afficher un style d'erreur
 * @param props - Les props du composant
 * @returns Un div stylisé contenant les enfants
 */
const SubWrapper = (props: SubWrapperProps) => {
  const children = props.children;
  // Style de base du wrapper
  const baseStyle = "flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10";
  // Style additionnel en cas d'erreur
  const errorStyle = "border-2 border-red-500";

  return (
    <div className={`${baseStyle} ${props.hasError ? errorStyle : ""}`}>
      {children}
    </div>
  );
};

export default SubWrapper;
