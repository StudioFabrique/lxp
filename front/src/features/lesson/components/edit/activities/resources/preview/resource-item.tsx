import {
  Download,
  Edit2Icon,
  Files,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import Wrapper from "../../../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import { Resource } from "../../../../../../../../src/utils/interfaces/activity";
import { ACTIVITIES } from "../../../../../../../config/urls";
import { Dispatch, SetStateAction } from "react";

type Props = {
  resource: Resource;
  onDeleteResource: (id: number) => void;
  onUpdateResource: Dispatch<SetStateAction<Resource | null>>;
};

function ResourceItem({ resource, onDeleteResource, onUpdateResource }: Props) {
  const displayIcon = (url: string) => {
    const extension = url.split(".").pop();
    switch (extension) {
      case "pdf":
        return <Files className="text-info" />;
      case "ppt":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-images text-info"
          >
            <path d="M18 22H4a2 2 0 0 1-2-2V6" />
            <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
            <circle cx="12" cy="8" r="2" />
            <rect width="16" height="16" x="6" y="2" rx="2" />
          </svg>
        );
      default:
        return <FileText className="text-info" />;
    }
  };

  const handleDownload = (url: string) => {
    window.open(ACTIVITIES + "/files/" + url, "_blank");
  };

  return (
    <Wrapper>
      <div className="grid grid-cols-4">
        <span className="col-span-1 flex gap-x-4 items-center">
          <GripVertical className="text-primary" /> {displayIcon(resource.url)}
        </span>
        <span className="col-span-2">{resource.label}</span>
        <span className="col-span-1 flex gap-x-8 items-center justify-end">
          <button onClick={() => handleDownload(resource.url)}>
            <Download className="text-primary" />
          </button>
          <button onClick={() => onUpdateResource(resource)}>
            <Edit2Icon className="text-primary" />
          </button>
          <button onClick={() => onDeleteResource(resource.id)}>
            <Trash2 className="text-error" />
          </button>
        </span>
      </div>
    </Wrapper>
  );
}

export default ResourceItem;
