/* eslint-disable @typescript-eslint/no-explicit-any */

import DocumentIcon from "../components/UI/svg/document-icon";
import QuestionCircleIcon from "../components/UI/svg/question-circle-icon";
import PlayCircleIcon from "../components/UI/svg/play-circle-icon";
import DiaporamaIcon from "../components/UI/svg/diaporama-icon";
import AudioIcon from "../components/UI/svg/audio-icon";
import PictureIcon from "../components/UI/svg/picture-icon";
import CursorArrowRippleIcon from "../components/UI/svg/cursor-arrow-ripple-icon";
import MapIcon from "../components/UI/svg/map-icon";
import DegreeIcon from "../components/UI/svg/degree-icon";
import UploadIcon from "../components/UI/svg/upload-icon.component";
import AddFolder from "../components/UI/svg/add-folder-icon";
import ActivityType from "../utils/interfaces/activity-type";

const activityTypes: ActivityType[] = [
  {
    icon: <DocumentIcon />,
    label: "Texte",
    tooltip: "Insérez un document écrit",
    type: "text",
  },
  {
    icon: <QuestionCircleIcon />,
    label: "Questions",
    tooltip: "",
    type: "questions",
  },
  {
    icon: <DiaporamaIcon />,
    label: "Diaporama",
    tooltip: "",
    type: "diaporama",
  },
  {
    icon: <PlayCircleIcon />,
    label: "Video",
    tooltip: "",
    type: "video",
  },
  {
    icon: <AudioIcon />,
    label: "Audio",
    tooltip: "",
    type: "audio",
  },
  {
    icon: <PictureIcon />,
    label: "Image",
    tooltip: "",
    type: "image",
  },
  {
    icon: <CursorArrowRippleIcon />,
    label: "Hotspot",
    tooltip: "",
    type: "hotspot",
  },
  {
    icon: <MapIcon />,
    label: "Branching Scenario",
    tooltip: "",
    type: "branching-scenario",
  },
  {
    icon: <DegreeIcon />,
    label: "Evaluation",
    tooltip: "",
    type: "evaluation",
  },
  {
    icon: <UploadIcon size={6} />,
    label: "Fichier",
    tooltip: "",
    type: "fichier",
  },
  {
    icon: <AddFolder />,
    label: "Espace Dépôt",
    tooltip: "",
    type: "espace-depot",
  },
];

function linksWithIds(tab: ActivityType[]) {
  let i = 1;
  let links: any = [];
  tab.forEach((item) => {
    if (!item.id || item.id === undefined) {
      links = [...links, { ...item, id: i }];
      i += 1;
    } else {
      links = [...links, item];
    }
  });
  return links;
}

export function getActivityTypes() {
  return linksWithIds(activityTypes);
}
