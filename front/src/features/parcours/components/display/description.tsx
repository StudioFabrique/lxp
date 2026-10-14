import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";
import { FileText } from "lucide-react";
import CollapsibleSection from "./collapsible-section";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";

type DescriptionProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Description = ({ open, onOpenChange }: DescriptionProps) => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(Number(id));
  const description = parcours?.description?.trim();

  if (!description) return null;

  return (
    <BoxWrapper className="h-auto gap-0 overflow-hidden p-0">
      <CollapsibleSection
        title="Description"
        icon={<FileText className="size-5 shrink-0" aria-hidden="true" />}
        className="bg-transparent"
        open={open}
        onOpenChange={onOpenChange}
        preview={
          <span className="line-clamp-2 text-sm first-letter:uppercase">
            {description}
          </span>
        }
      >
        <p className="first-letter:uppercase">{description}</p>
      </CollapsibleSection>
    </BoxWrapper>
  );
};

export default Description;
