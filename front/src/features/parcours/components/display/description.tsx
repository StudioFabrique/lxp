import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";
import CollapsibleSection from "./collapsible-section";

const Description = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(Number(id));
  const description = parcours?.description?.trim();

  if (!description) return null;

  return (
    <CollapsibleSection
      title="Description"
      preview={
        <span className="line-clamp-2 text-sm first-letter:uppercase">
          {description}
        </span>
      }
    >
      <p className="first-letter:uppercase">{description}</p>
    </CollapsibleSection>
  );
};

export default Description;
